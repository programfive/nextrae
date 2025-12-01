import { getMaterialsByIds } from "@/actions/catalog";
import { getLoansByUser } from "@/actions/loans";
import { LoansPage } from "@/components/app/loans/LoansPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data } = await getLoansByUser();
  const materialIds = Array.from(
    new Set((data ?? []).map((l) => l.material_id))
  );
  const { data: mats } = await getMaterialsByIds(materialIds);
  return <LoansPage loans={data} materials={mats} />;
}
