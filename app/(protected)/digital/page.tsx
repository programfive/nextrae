import { getDigitalMaterials, getUserDownloads } from "@/actions/digital";
import { DigitalPage } from "@/components/app/digital/DigitalPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [{ data: materials }, { data: downloads }] = await Promise.all([
    getDigitalMaterials(),
    getUserDownloads(),
  ]);

  return <DigitalPage materials={materials} downloads={downloads} />;
}
