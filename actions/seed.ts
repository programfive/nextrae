"use server";

import { createClient } from "@/lib/supabase/server";

export async function seedDemo() {
  const supabase = await createClient();
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user?.id) return { ok: false, error: "No autenticado" } as const;
  const uid = userRes.user.id;

  const wantedTitles = [
    "Inteligencia Artificial Moderna",
    "Diseño de Bases de Datos",
    "Marketing Digital",
    "Programación en Python",
  ];

  const { data: mats, error: matsErr } = await supabase
    .from("materials")
    .select("id,title")
    .in("title", wantedTitles);
  if (matsErr) return { ok: false, error: matsErr.message } as const;

  const byTitle = new Map((mats ?? []).map((m) => [m.title, m.id as string]));

  const ia = byTitle.get("Inteligencia Artificial Moderna");
  const diseno = byTitle.get("Diseño de Bases de Datos");
  const marketing = byTitle.get("Marketing Digital");
  const python = byTitle.get("Programación en Python");

  if (ia) {
    const { data: existsActive } = await supabase
      .from("loans")
      .select("id")
      .eq("user_id", uid)
      .eq("material_id", ia)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();
    if (!existsActive) {
      await supabase.from("loans").insert({
        material_id: ia,
        user_id: uid,
        loan_date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        due_date: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
        return_date: null,
        renewals: 0,
        status: "active",
      });
    }
  }

  if (marketing) {
    const { data: existsReturned } = await supabase
      .from("loans")
      .select("id")
      .eq("user_id", uid)
      .eq("material_id", marketing)
      .eq("status", "returned")
      .limit(1)
      .maybeSingle();
    if (!existsReturned) {
      await supabase.from("loans").insert({
        material_id: marketing,
        user_id: uid,
        loan_date: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(),
        due_date: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
        return_date: new Date(Date.now() - 24 * 24 * 3600 * 1000).toISOString(),
        renewals: 1,
        status: "returned",
      });
    }
  }

  if (diseno) {
    const { data: existsPending } = await supabase
      .from("reservations")
      .select("id")
      .eq("user_id", uid)
      .eq("material_id", diseno)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();
    if (!existsPending) {
      await supabase.from("reservations").insert({
        material_id: diseno,
        user_id: uid,
        reservation_date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        expiry_date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
        completed_date: null,
        status: "pending",
      });
    }
  }

  if (python) {
    const { data: existsCompleted } = await supabase
      .from("reservations")
      .select("id")
      .eq("user_id", uid)
      .eq("material_id", python)
      .eq("status", "completed")
      .limit(1)
      .maybeSingle();
    if (!existsCompleted) {
      await supabase.from("reservations").insert({
        material_id: python,
        user_id: uid,
        reservation_date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
        expiry_date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        completed_date: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
        status: "completed",
      });
    }
  }

  return { ok: true, error: null } as const;
}
