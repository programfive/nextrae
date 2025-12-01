import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: currentUser } = await supabase
    .from("users_with_auth")
    .select("full_name, email, roles:role_id ( code )")
    .eq("user_id", user.id)
    .maybeSingle<{
      full_name: string | null;
      email: string | null;
      roles: { code: "administrador" | "bibliotecario" | "usuario" } | null;
    }>();

  const dbRoleCode = currentUser?.roles?.code;

  const role: "admin" | "librarian" | "user" =
    dbRoleCode === "administrador"
      ? "admin"
      : dbRoleCode === "bibliotecario"
      ? "librarian"
      : "user";

  const userName =
    currentUser?.full_name ?? user.user_metadata?.full_name ?? null;
  const userEmail = currentUser?.email ?? user.email ?? null;

  return (
    <DashboardLayout role={role} userName={userName} userEmail={userEmail}>
      {children}
    </DashboardLayout>
  );
}
