"use server";

import { createClient } from "@/lib/supabase/server";

export type Loan = {
  id: string;
  material_id: string;
  user_id: string;
  loan_date: string;
  due_date: string;
  return_date: string | null;
  renewals: number;
  status: "active" | "returned" | "overdue";
  material?: {
    id: string;
    title: string;
    author: string;
  } | null;
};

export async function getLoansByUser() {
  const supabase = await createClient();
  const { data: userRes } = await supabase.auth.getUser();
  const uid = userRes?.user?.id;
  if (!uid) return { data: [] as Loan[], error: null } as const;

  const { data, error } = await supabase
    .from("loans")
    .select(
      "id,material_id,user_id,loan_date,due_date,return_date,renewals,status"
    )
    .eq("user_id", uid)
    .order("loan_date", { ascending: false });

  if (error) return { data: [] as Loan[], error } as const;
  return { data: (data ?? []) as unknown as Loan[], error: null } as const;
}

export async function createLoan(materialId: string) {
  const supabase = await createClient();

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user?.id) {
    return { ok: false, error: "No autenticado" } as const;
  }
  const uid = userRes.user.id;

  const { data: material, error: matErr } = await supabase
    .from("materials")
    .select("id,type,status,copies_total,copies_available")
    .eq("id", materialId)
    .maybeSingle();

  if (matErr) return { ok: false, error: matErr.message } as const;
  if (!material) return { ok: false, error: "Material no encontrado" } as const;
  if (material.type !== "physical") {
    return {
      ok: false,
      error: "Solo se pueden prestar materiales físicos",
    } as const;
  }
  if (material.status !== "available" && material.copies_available <= 0) {
    return {
      ok: false,
      error: "El material no está disponible para préstamo",
    } as const;
  }

  if (material.copies_available <= 0) {
    return {
      ok: false,
      error: "No hay copias disponibles para préstamo",
    } as const;
  }

  // Evitar que el usuario tenga más de un préstamo activo del mismo material
  const { data: existingLoans, error: existingErr } = await supabase
    .from("loans")
    .select("id")
    .eq("material_id", materialId)
    .eq("user_id", uid)
    .eq("status", "active")
    .limit(1);

  if (existingErr) return { ok: false, error: existingErr.message } as const;

  if (existingLoans && existingLoans.length > 0) {
    return {
      ok: false,
      error: "Ya tienes un préstamo activo para este material",
    } as const;
  }

  const now = new Date();
  const LOAN_DAYS = Number(process.env.LOAN_DAYS_DURATION ?? "15");
  const dueDate = new Date(now.getTime() + LOAN_DAYS * 24 * 60 * 60 * 1000);

  const { error: loanErr } = await supabase.from("loans").insert({
    material_id: materialId,
    user_id: uid,
    loan_date: now.toISOString(),
    due_date: dueDate.toISOString(),
    return_date: null,
    renewals: 0,
    status: "active",
  });

  if (loanErr) return { ok: false, error: loanErr.message } as const;

  const nextCopies = (material.copies_available ?? 1) - 1;
  const nextStatus = nextCopies <= 0 ? "loaned" : material.status;

  const { error: updateErr } = await supabase
    .from("materials")
    .update({ status: nextStatus, copies_available: nextCopies })
    .eq("id", materialId);

  if (updateErr) return { ok: false, error: updateErr.message } as const;

  return { ok: true, error: null } as const;
}

export async function renewLoan(loanId: string) {
  const supabase = await createClient();

  const { data: userRes } = await supabase.auth.getUser();
  const uid = userRes?.user?.id;
  if (!uid) return { ok: false, error: "No autenticado" } as const;

  const { data: loan, error: loanErr } = await supabase
    .from("loans")
    .select("id,user_id,status,due_date,renewals")
    .eq("id", loanId)
    .maybeSingle();

  if (loanErr) return { ok: false, error: loanErr.message } as const;
  if (!loan || loan.user_id !== uid)
    return { ok: false, error: "Préstamo no encontrado" } as const;
  if (loan.status !== "active")
    return {
      ok: false,
      error: "Solo se pueden renovar préstamos activos",
    } as const;

  const MAX_RENEWALS = Number(process.env.LOAN_MAX_RENEWALS ?? "2");
  if (loan.renewals >= MAX_RENEWALS)
    return {
      ok: false,
      error: "Se alcanzó el máximo de renovaciones",
    } as const;

  const currentDue = new Date(loan.due_date);
  const LOAN_DAYS = Number(process.env.LOAN_DAYS_DURATION ?? "15");
  const newDue = new Date(
    currentDue.getTime() + LOAN_DAYS * 24 * 60 * 60 * 1000
  );

  const { error: updErr } = await supabase
    .from("loans")
    .update({
      due_date: newDue.toISOString(),
      renewals: loan.renewals + 1,
    })
    .eq("id", loanId);

  if (updErr) return { ok: false, error: updErr.message } as const;
  return { ok: true, error: null } as const;
}

export async function returnLoan(loanId: string) {
  const supabase = await createClient();

  const { data: userRes } = await supabase.auth.getUser();
  const uid = userRes?.user?.id;
  if (!uid) return { ok: false, error: "No autenticado" } as const;

  const { data: loan, error: loanErr } = await supabase
    .from("loans")
    .select("id,user_id,material_id,status,due_date")
    .eq("id", loanId)
    .maybeSingle();

  if (loanErr) return { ok: false, error: loanErr.message } as const;
  if (!loan || loan.user_id !== uid)
    return { ok: false, error: "Préstamo no encontrado" } as const;
  if (loan.status !== "active")
    return { ok: false, error: "El préstamo ya no está activo" } as const;

  const now = new Date();
  const status: Loan["status"] =
    now > new Date(loan.due_date) ? "overdue" : "returned";

  const { error: updErr } = await supabase
    .from("loans")
    .update({
      status,
      return_date: now.toISOString(),
    })
    .eq("id", loanId);

  if (updErr) return { ok: false, error: updErr.message } as const;

  const { data: material, error: matErr1 } = await supabase
    .from("materials")
    .select("id,status,copies_total,copies_available")
    .eq("id", loan.material_id)
    .maybeSingle();

  if (matErr1) return { ok: false, error: matErr1.message } as const;
  if (!material)
    return {
      ok: false,
      error: "Material no encontrado para préstamo",
    } as const;

  const nextCopies = Math.min(
    (material.copies_available ?? 0) + 1,
    material.copies_total ?? 1
  );
  const nextStatus = nextCopies > 0 ? "available" : material.status;

  const { error: matErr2 } = await supabase
    .from("materials")
    .update({ status: nextStatus, copies_available: nextCopies })
    .eq("id", loan.material_id);

  if (matErr2) return { ok: false, error: matErr2.message } as const;

  return { ok: true, error: null } as const;
}
