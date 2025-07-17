import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus, IconPackage, IconTruck, IconShoppingCart } from "@tabler/icons-react";
import { Widget } from "@/components/cards/widget";

export default function InventoryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            Nuevo Movimiento
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          title="Stock Total"
          value="0"
          description="Stock Total"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Unidades en inventario"
          footerDescription="Total de unidades disponibles"
        />
        <Widget
          title="Valor Total"
          value="$0.00"
          description="Valor Total"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Valor del inventario"
          footerDescription="Valor total del stock disponible"
        />
        <Widget
          title="Entradas"
          value="0"
          description="Entradas"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Movimientos de entrada"
          footerDescription="Total de entradas de stock"
        />
        <Widget
          title="Salidas"
          value="0"
          description="Salidas"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Movimientos de salida"
          footerDescription="Total de salidas de stock"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Movimientos de Inventario</CardTitle>
            <CardDescription>
              Historial de entradas y salidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No hay movimientos registrados aún
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Operaciones de inventario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <IconTruck className="mr-2 h-4 w-4" />
              Entrada de Stock
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconShoppingCart className="mr-2 h-4 w-4" />
              Salida de Stock
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Ajuste de Inventario
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Reporte de Stock
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 