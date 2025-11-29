"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type MaterialFilters = {
  search?: string;
  category?: string;
  type?: "physical" | "digital" | "thesis";
  status?: "available" | "loaned" | "reserved";
  page?: number;
  pageSize?: number;
};

export type Material = {
  id: string;
  title: string;
  author: string;
  category: string | null;
  category_id?: string | null;
  categories?: { name: string | null; slug: string | null } | null;
  year: number | null;
  type: "physical" | "digital" | "thesis";
  status: "available" | "loaned" | "reserved";
  isbn: string | null;
  description: string | null;
  created_at: string;
  file_url?: string | null;
  digital_assets?: {
    id: string;
    material_id: string;
    file_path: string | null;
    pages: number | null;
    size_bytes: number | null;
  }[];
};

export type CreateMaterialInput = {
  title: string;
  author: string;
  categoryIds?: string[];
  year?: string | null;
  type: Material["type"];
  status: Material["status"];
  isbn?: string | null;
  description?: string | null;
  filePath?: string | null;
};

export async function createMaterial(input: CreateMaterialInput) {
  const supabase = await createClient();

  const title = input.title.trim();
  const author = input.author.trim();
  const isbn = input.isbn?.trim() || null;
  const description = input.description?.trim() || null;
  const category_id = input.categoryIds?.[0] ?? null;
  const filePath = input.filePath?.trim() || null;

  const yearNumber = input.year ? Number(input.year) : null;
  const year = yearNumber && !Number.isNaN(yearNumber) ? yearNumber : null;

  if (!title || !author) {
    return { ok: false, id: null as string | null, error: "Título y autor son obligatorios" } as const;
  }

  const { data, error } = await supabase
    .from("materials")
    .insert({
      title,
      author,
      category_id,
      year,
      type: input.type,
      status: input.status,
      isbn,
      description,
      file_url: filePath,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("createMaterial error", error);
    return { ok: false, id: null as string | null, error: error.message } as const;
  }

  const materialId = (data as { id: string } | null)?.id ?? null;

  if (materialId && input.type === "digital" && filePath) {
    const { error: digitalError } = await supabase
      .from("digital_assets")
      .insert({
        material_id: materialId,
        file_path: filePath,
        pages: null,
        size_bytes: null,
      });

    if (digitalError) {
      console.error("createMaterial digital_assets error", digitalError);
      return { ok: false, id: materialId, error: digitalError.message } as const;
    }
  }

  revalidatePath("/catalog");

  return { ok: true, id: materialId, error: null } as const;
}

export async function getMaterials(filters: MaterialFilters = {}) {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 24));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("materials")
    .select(
      "id,title,author,category,category_id,year,type,status,isbn,description,created_at,file_url, digital_assets(id,material_id,file_path,pages,size_bytes), categories(name,slug)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (filters.category && filters.category !== "all") {
    const c = filters.category.trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(c);
    if (isUuid) {
      query = query.eq("category_id", c);
    } else {
      query = query.or([`category.eq.${c}`, `categories.slug.eq.${c}`].join(","));
    }
  }
  if (filters.type && (filters.type as string) !== "all") {
    query = query.eq("type", filters.type);
  }
  if (filters.status && (filters.status as string) !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.search) {
    const s = filters.search.trim();
    if (s) {
      query = query.or(
        [
          `title.ilike.%${s}%`,
          `author.ilike.%${s}%`,
          `isbn.ilike.%${s}%`,
          `description.ilike.%${s}%`,
        ].join(",")
      );
    }
  }

  const { data, error, count } = await query.range(from, to);
  if (error) return { data: [] as Material[], count: 0, error } as const;
  // Supabase returns rows with digital_assets as an array relation; coerce to our Material type
  const rows = (data ?? []) as unknown as Material[];
  return { data: rows, count: count ?? 0, error: null } as const;
}

export async function getMaterialById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materials")
    .select("id,title,author,category,category_id,year,type,status,isbn,description,created_at,file_url, digital_assets(id,material_id,file_path,pages,size_bytes), categories(name,slug)")
    .eq("id", id)
    .single();
  return { data: (data as unknown as Material) ?? null, error } as const;
}

export async function getMaterialsByIds(ids: string[]) {
  if (!ids?.length) return { data: [] as Pick<Material, "id" | "title" | "author">[], error: null } as const;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materials")
    .select("id,title,author")
    .in("id", ids);
  return { data: (data ?? []) as { id: string; title: string; author: string }[], error } as const;
}
