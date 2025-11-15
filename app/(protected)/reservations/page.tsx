import { ReservationsPage } from "@/components/app/reservations/ReservationsPage";
import { getReservationsByUser } from "@/actions/reservations";
import { getMaterialsByIds } from "@/actions/catalog";

export default async function Page() {
  const { data } = await getReservationsByUser();
  const materialIds = Array.from(new Set((data ?? []).map((r) => r.material_id)));
  const { data: mats } = await getMaterialsByIds(materialIds);
  return <ReservationsPage reservations={data} materials={mats} />;
}
