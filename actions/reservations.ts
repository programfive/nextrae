"use server";

import { createClient } from "@/lib/supabase/server";

export type Reservation = {
  id: string;
  material_id: string;
  user_id: string;
  reservation_date: string;
  expiry_date: string;
  completed_date: string | null;
  status: "pending" | "completed" | "expired" | "cancelled";
};

export async function getReservationsByUser() {
  const supabase = await createClient();
  const { data: userRes } = await supabase.auth.getUser();
  const uid = userRes?.user?.id;
  if (!uid) return { data: [] as Reservation[], error: null } as const;

  const { data, error } = await supabase
    .from("reservations")
    .select("id,material_id,user_id,reservation_date,expiry_date,completed_date,status")
    .eq("user_id", uid)
    .order("reservation_date", { ascending: false });

  if (error) return { data: [] as Reservation[], error } as const;
  return { data: (data ?? []) as unknown as Reservation[], error: null } as const;
}

export async function createReservation(materialId: string) {
  const supabase = await createClient();
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user?.id) return { ok: false, error: "No autenticado" } as const;
  const uid = userRes.user.id;

  // Simple check: avoid duplicate active pending reservation for same material
  const { data: existing, error: exErr } = await supabase
    .from("reservations")
    .select("id")
    .eq("user_id", uid)
    .eq("material_id", materialId)
    .eq("status", "pending")
    .limit(1)
    .maybeSingle();
  if (exErr) return { ok: false, error: exErr.message } as const;
  if (existing) return { ok: true, error: null } as const;

  const now = new Date();
  const expiry = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const { error } = await supabase.from("reservations").insert({
    material_id: materialId,
    user_id: uid,
    reservation_date: now.toISOString(),
    expiry_date: expiry.toISOString(),
    completed_date: null,
    status: "pending",
  });
  if (error) return { ok: false, error: error.message } as const;
  return { ok: true, error: null } as const;
}
