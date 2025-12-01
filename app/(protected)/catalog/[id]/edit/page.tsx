import {
  getMaterialById,
  updateMaterial,
  type UpdateMaterialInput,
} from "@/actions/catalog";
import { getCategories } from "@/actions/categories";
import {
  CreateMaterialPage,
  type MaterialFormInput,
} from "@/components/app/catalog/CreateMaterialPage";
import { redirect } from "next/navigation";

type PageParams = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageParams) {
  const { id } = await params;

  const [{ data: material }, { data: categories }] = await Promise.all([
    getMaterialById(id),
    getCategories(),
  ]);

  if (!material) {
    redirect("/catalog");
  }

  const defaultValues: Partial<MaterialFormInput> = {
    title: material.title ?? "",
    author: material.author ?? "",
    categoryIds: material.category_id ? [material.category_id] : [],
    year: material.year ? String(material.year) : "",
    copies: material.copies_total ? String(material.copies_total) : undefined,
    type:
      material.type === "physical" || material.type === "digital"
        ? material.type
        : undefined,
    status: material.status,
    isbn: material.isbn ?? "",
    description: material.description ?? "",
    filePath:
      material.file_url ||
      (material.digital_assets && material.digital_assets[0]?.file_path) ||
      undefined,
  };

  async function updateMaterialAction(
    values: Omit<MaterialFormInput, "file">
  ): Promise<void> {
    "use server";

    const payload: UpdateMaterialInput = {
      id,
      title: values.title,
      author: values.author,
      categoryIds: values.categoryIds,
      year: values.year,
      copies: values.copies,
      type: values.type,
      status: values.status,
      isbn: values.isbn,
      description: values.description,
      filePath: values.filePath ?? null,
    };

    const result = await updateMaterial(payload);

    if (!result.ok) {
      throw new Error(result.error || "No se pudo actualizar el material");
    }

    redirect("/catalog");
  }

  return (
    <CreateMaterialPage
      categories={categories ?? []}
      createMaterialAction={updateMaterialAction}
      defaultValues={defaultValues}
      title="Editar material"
    />
  );
}
