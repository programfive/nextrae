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
    .select("id,material_id,user_id,loan_date,due_date,return_date,renewals,status")
    .eq("user_id", uid)
    .order("loan_date", { ascending: false });

  if (error) return { data: [] as Loan[], error } as const;
  return { data: (data ?? []) as unknown as Loan[], error: null } as const;
}
