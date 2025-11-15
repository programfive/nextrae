import { getMaterials } from "@/actions/catalog";
import { getCategories } from "@/actions/categories";
import { CatalogPage } from "@/components/app/catalog/CatalogPage";

type CatalogSearchParams = {
  q?: string;
  category?: string;
  type?: "physical" | "digital" | "thesis" | "all";
  status?: "available" | "loaned" | "reserved" | "all";
  page?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<CatalogSearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const { data } = await getMaterials({
    search: params.q,
    category: params.category,
    type: params.type && params.type !== "all" ? params.type : undefined,
    status:
      params.status && params.status !== "all" ? params.status : undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: 24,
  });
  const { data: categories } = await getCategories();
  return (
    <CatalogPage
      materials={data}
      categories={categories}
      initialCategory={params.category ?? "all"}
    />
  );
}
