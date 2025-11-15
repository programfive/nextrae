import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes?.user?.id) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }
    const uid = userRes.user.id;

    // Validación de entrada
    const bodySchema = z.object({
      materialId: z.string().min(1, "materialId requerido"),
    });
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }
    const { materialId } = parsed.data;

    // Evitar duplicado pendiente
    const { data: existing, error: exErr } = await supabase
      .from("reservations")
      .select("id")
      .eq("user_id", uid)
      .eq("material_id", materialId)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();
    if (exErr) {
      return NextResponse.json({ ok: false, error: exErr.message }, { status: 400 });
    }
    if (existing) {
      return NextResponse.json({ ok: true });
    }

    const now = new Date();
    const EXP_DAYS = Number(process.env.RESERVATION_EXPIRY_DAYS ?? "5");
    const expiry = new Date(now.getTime() + EXP_DAYS * 24 * 60 * 60 * 1000);
    const { error } = await supabase.from("reservations").insert({
      material_id: materialId,
      user_id: uid,
      reservation_date: now.toISOString(),
      expiry_date: expiry.toISOString(),
      completed_date: null,
      status: "pending",
    });
    if (error) {
      // Mapear error por conflicto de clave única a 409
      const isConflict = error.code === "23505" || error.code === "PGRST116" || error.details?.includes("duplicate key");
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: isConflict ? 409 : 400 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
