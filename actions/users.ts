"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type RoleCode = "administrador" | "bibliotecario" | "usuario";

export type UserListItem = {
  user_id: string;
  full_name: string;
  email: string;
  role_code: RoleCode;
  role_name: string;
  loans_count: number;
  created_at: string | null;
  email_confirmed: boolean;
};

export type UserStats = {
  total: number;
  active: number;
  byRole: Record<RoleCode, number>;
};

export async function listUsers(params?: {
  search?: string;
  role?: RoleCode | "all";
}) {
  const supabase = await createClient();

  let query = supabase
    .from("users_with_auth")
    .select(
      `user_id, full_name, email, role_id, created_at, email_confirmed, roles:role_id ( id, name, code )`
    );

  if (params?.search) {
    const search = `%${params.search}%`;
    query = query.or(`full_name.ilike.${search},email.ilike.${search}`);
  }

  if (params?.role && params.role !== "all") {
    query = query.eq("roles.code", params.role);
  }

  const { data, error } = await query.order("full_name", { ascending: true });

  if (error) {
    console.error("listUsers error", error);
    return {
      data: [] as UserListItem[],
      stats: null as UserStats | null,
      error,
    } as const;
  }

  type DbUserRow = {
    user_id: string;
    full_name: string;
    email: string;
    created_at: string | null;
    email_confirmed: boolean | null;
    role_id: number | null;
    roles: { code: RoleCode | null; name: string | null }[] | null;
  };

  const users: UserListItem[] = ((data ?? []) as DbUserRow[]).map((row) => {
    const role = row.roles?.[0] ?? null;

    // Fallback basado en role_id si el join de roles no trajo datos
    let fallbackCode: RoleCode = "usuario";
    switch (row.role_id) {
      case 1:
        fallbackCode = "administrador";
        break;
      case 2:
        fallbackCode = "bibliotecario";
        break;
      case 3:
        fallbackCode = "usuario";
        break;
      default:
        fallbackCode = "usuario";
    }

    const code = (role?.code as RoleCode | null) ?? fallbackCode;
    const name =
      role?.name ??
      (code === "administrador"
        ? "Administrador"
        : code === "bibliotecario"
        ? "Bibliotecario"
        : "Usuario");

    return {
      user_id: row.user_id,
      full_name: row.full_name,
      email: row.email,
      role_code: code,
      role_name: name,
      // TODO: podríamos calcular loans_count con una vista o agregación; por ahora 0
      loans_count: 0,
      created_at: row.created_at ?? null,
      email_confirmed: !!row.email_confirmed,
    };
  });

  const stats: UserStats = {
    total: users.length,
    active: users.length, // por ahora todos activos
    byRole: {
      administrador: users.filter((u) => u.role_code === "administrador")
        .length,
      bibliotecario: users.filter((u) => u.role_code === "bibliotecario")
        .length,
      usuario: users.filter((u) => u.role_code === "usuario").length,
    },
  };

  return { data: users, stats, error: null } as const;
}

async function getRoleIdByCode(code: RoleCode, supabase: unknown) {
  const client = supabase as Awaited<ReturnType<typeof createClient>>;

  const { data, error } = await client
    .from("roles")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (error || !data) {
    throw new Error("No se encontró el rol: " + code);
  }

  return data.id as number;
}

export async function createUserAction(formData: FormData) {
  const supabase = await createClient();

  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "usuario") as RoleCode;

  if (!full_name || !email) {
    return {
      ok: false,
      error: "Nombre completo y email son obligatorios",
    } as const;
  }

  const { data: userAuth, error: userAuthError } = await supabase
    .from("users")
    .select("user_id")
    .eq("email", email)
    .maybeSingle();

  if (userAuthError || !userAuth?.user_id) {
    return {
      ok: false,
      error:
        "No se encontró un usuario de autenticación con ese email. Debes crear primero la cuenta en Auth.",
    } as const;
  }

  const roleId = await getRoleIdByCode(role, supabase);

  const { error } = await supabase.from("users").upsert(
    {
      user_id: userAuth.user_id,
      full_name,
      email,
      role_id: roleId,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("createUserAction error", error);
    return { ok: false, error: error.message } as const;
  }

  revalidatePath("/users");

  return { ok: true, error: null } as const;
}

export async function updateUserAction(formData: FormData) {
  const supabase = await createClient();

  const user_id = String(formData.get("user_id") ?? "").trim();
  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "user") as RoleCode;

  if (!user_id) {
    return { ok: false, error: "Falta el identificador de usuario" } as const;
  }

  const roleId = await getRoleIdByCode(role, supabase);

  const payload: Record<string, unknown> = { role_id: roleId };
  if (full_name) payload.full_name = full_name;
  if (email) payload.email = email;

  const { error } = await supabase
    .from("users")
    .update(payload)
    .eq("user_id", user_id);

  if (error) {
    console.error("updateUserAction error", error);
    return { ok: false, error: error.message } as const;
  }

  revalidatePath("/users");

  return { ok: true, error: null } as const;
}
