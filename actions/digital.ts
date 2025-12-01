"use server";

import { createClient } from "@/lib/supabase/server";

export type DigitalMaterial = {
  id: string;
  title: string;
  author: string;
  category: string | null;
  year: number | null;
  type: "digital" | "thesis";
  status: "available" | "loaned" | "reserved";
  isbn: string | null;
  description: string | null;
  file_url: string | null;
  pages: number | null;
  size_bytes: number | null;
};

export type UserDownload = {
  id: string;
  material_id: string;
  downloaded_at: string;
  material: {
    id: string;
    title: string;
    author: string;
  } | null;
};

export async function getDigitalMaterials() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("materials")
    .select(
      "id,title,author,category,year,type,status,isbn,description,file_url, digital_assets(pages,size_bytes)"
    )
    .in("type", ["digital", "thesis"] as const)
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [] as DigitalMaterial[], error } as const;
  }

  const rows = (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    author: (row.author ?? "") as string,
    category: (row.category ?? null) as string | null,
    year: (row.year ?? null) as number | null,
    type: (row.type as "digital" | "thesis") ?? "digital",
    status: (row.status as "available" | "loaned" | "reserved") ?? "available",
    isbn: (row.isbn ?? null) as string | null,
    description: (row.description ?? null) as string | null,
    file_url: (row.file_url ?? null) as string | null,
    pages:
      Array.isArray(row.digital_assets) && row.digital_assets[0]
        ? (row.digital_assets[0].pages as number | null)
        : null,
    size_bytes:
      Array.isArray(row.digital_assets) && row.digital_assets[0]
        ? (row.digital_assets[0].size_bytes as number | null)
        : null,
  })) satisfies DigitalMaterial[];

  return { data: rows, error: null } as const;
}

export async function getUserDownloads() {
  const supabase = await createClient();

  const { data: userRes } = await supabase.auth.getUser();
  const uid = userRes?.user?.id;
  if (!uid) return { data: [] as UserDownload[], error: null } as const;

  const { data, error } = await supabase
    .from("downloads")
    .select("id,material_id,downloaded_at, materials(id,title,author)")
    .eq("user_id", uid)
    .order("downloaded_at", { ascending: false });

  if (error) return { data: [] as UserDownload[], error } as const;

  const rows = (data ?? []).map((row) => ({
    id: row.id as string,
    material_id: row.material_id as string,
    downloaded_at: row.downloaded_at as string,
    material: (() => {
      const material = Array.isArray(row.materials)
        ? row.materials[0]
        : row.materials;

      return material
        ? {
            id: material.id as string,
            title: (material.title ?? "") as string,
            author: (material.author ?? "") as string,
          }
        : null;
    })(),
  })) satisfies UserDownload[];

  return { data: rows, error: null } as const;
}
