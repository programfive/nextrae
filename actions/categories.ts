"use server";

import { createClient } from "@/lib/supabase/server";

export type Category = {
  id: string;
  name: string;
  slug: string | null;
  created_at: string;
};

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,created_at")
    .order("name", { ascending: true });

  return { data: (data ?? []) as Category[], error } as const;
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,created_at")
    .eq("slug", slug)
    .maybeSingle();

  return { data: (data as unknown as Category) ?? null, error } as const;
}
