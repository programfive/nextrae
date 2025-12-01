import { getMaterials } from "@/actions/catalog";
import { getCategories } from "@/actions/categories";
import { CatalogPage } from "@/components/app/catalog/CatalogPage";
import { createClient } from "@/lib/supabase/server";

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
  const { data, count } = await getMaterials({
    search: params.q,
    category: params.category,
    type: params.type && params.type !== "all" ? params.type : undefined,
    status:
      params.status && params.status !== "all" ? params.status : undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: 24,
  });
  const { data: categories } = await getCategories();
  // Derivar el rol real del usuario desde Supabase y la tabla de roles
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let canEdit = false;

  if (user) {
    type RoleCode = "administrador" | "bibliotecario" | "usuario";
    type CurrentUser = {
      roles: { code: RoleCode } | null;
    };

    const { data: currentUser } = await supabase
      .from("users_with_auth")
      .select("roles:role_id ( code )")
      .eq("user_id", user.id)
      .maybeSingle<CurrentUser>();

    const roleCode = currentUser?.roles?.code;

    canEdit = roleCode === "administrador" || roleCode === "bibliotecario";
  }
  return (
    <CatalogPage
      materials={data}
      categories={categories}
      initialCategory={params.category ?? "all"}
      totalCount={count ?? 0}
      currentPage={params.page ? Number(params.page) : 1}
      pageSize={24}
      canEdit={canEdit}
    />
  );
}
