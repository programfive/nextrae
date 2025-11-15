import { seedDemo } from "@/actions/seed";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const res = await seedDemo();
  return (
    <div className="p-6 space-y-4">
      <h2>Semilla de datos de ejemplo</h2>
      {res.ok ? (
        <p className="text-sm text-muted-foreground">Datos de ejemplo creados (si no existían) para tu usuario.</p>
      ) : (
        <p className="text-sm text-destructive">{res.error ?? "Error al ejecutar seed"}</p>
      )}
      <div>
        <Button asChild>
          <a href="/loans">Ir a Mis Préstamos</a>
        </Button>
        <Button asChild variant="outline" className="ml-2">
          <a href="/reservations">Ir a Mis Reservas</a>
        </Button>
      </div>
    </div>
  );
}
