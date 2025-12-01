import { createMaterial } from "@/actions/catalog";
import { getCategories } from "@/actions/categories";
import {
  CreateMaterialPage,
  type MaterialFormInput,
} from "@/components/app/catalog/CreateMaterialPage";
import { redirect } from "next/navigation";

export default async function Page() {
  const { data: categories } = await getCategories();

  async function createMaterialAction(values: Omit<MaterialFormInput, "file">) {
    "use server";

    const result = await createMaterial({
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
    });

    if (!result.ok) {
      throw new Error(result.error || "No se pudo crear el material");
    }

    redirect("/catalog");
  }

  return (
    <CreateMaterialPage
      categories={categories ?? []}
      createMaterialAction={createMaterialAction}
    />
  );
}
