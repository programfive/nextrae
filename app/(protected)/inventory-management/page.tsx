import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconArchive, IconPackage, IconTruck, IconShoppingCart, IconAlertTriangle } from "@tabler/icons-react";
import { Widget } from "@/components/cards/widget";

export default function InventoryManagementPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Inventario</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconArchive className="mr-2 h-4 w-4" />
            Nuevo Movimiento
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          title="Movimientos"
          value="0"
          description="Movimientos"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Total de movimientos"
          footerDescription="Movimientos de inventario registrados"
        />
        <Widget
          title="Lotes"
          value="0"
          description="Lotes"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Lotes activos"
          footerDescription="Lotes de productos activos"
        />
        <Widget
          title="Mermas"
          value="0"
          description="Mermas"
          trend={{ value: "0", isPositive: false }}
          footerText="Productos con mermas"
          footerDescription="Productos con pérdidas registradas"
        />
        <Widget
          title="Ajustes"
          value="0"
          description="Ajustes"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Ajustes realizados"
          footerDescription="Ajustes de inventario completados"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Módulos de Gestión</CardTitle>
            <CardDescription>
              Accede a las diferentes herramientas de gestión de inventario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col justify-center" asChild>
                <a href="/inventory/movements">
                  <IconArchive className="h-6 w-6 mb-2" />
                  <span>Movimientos</span>
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center" asChild>
                <a href="/inventory/batches">
                  <IconPackage className="h-6 w-6 mb-2" />
                  <span>Lotes</span>
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center" asChild>
                <a href="/inventory/wastes">
                  <IconAlertTriangle className="h-6 w-6 mb-2" />
                  <span>Mermas</span>
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconArchive className="h-6 w-6 mb-2" />
                <span>Ajustes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Operaciones comunes de inventario
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
              <IconArchive className="mr-2 h-4 w-4" />
              Ajuste de Inventario
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconPackage className="mr-2 h-4 w-4" />
              Control de Lotes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 