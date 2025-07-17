import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconBuildingStore, IconShoppingCart, IconPackage, IconUsers, IconCurrencyDollar } from "@tabler/icons-react";
import { Widget } from "@/components/cards/widget";

export default function StorePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tienda</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconBuildingStore className="mr-2 h-4 w-4" />
            Nueva Venta
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          title="Ventas Hoy"
          value="0"
          description="Ventas Hoy"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Ventas realizadas hoy"
          footerDescription="Ventas completadas hoy"
        />
        <Widget
          title="Ingresos Hoy"
          value="$0.00"
          description="Ingresos Hoy"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Ingresos del día"
          footerDescription="Ingresos generados hoy"
        />
        <Widget
          title="Productos"
          value="0"
          description="Productos"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Productos disponibles"
          footerDescription="Productos en stock"
        />
        <Widget
          title="Clientes"
          value="0"
          description="Clientes"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Clientes atendidos"
          footerDescription="Clientes atendidos hoy"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Productos Destacados</CardTitle>
            <CardDescription>
              Productos más populares y con mejor rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No hay productos destacados aún
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Operaciones de la tienda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <IconShoppingCart className="mr-2 h-4 w-4" />
              Nueva Venta
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconPackage className="mr-2 h-4 w-4" />
              Ver Productos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconUsers className="mr-2 h-4 w-4" />
              Gestionar Clientes
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconCurrencyDollar className="mr-2 h-4 w-4" />
              Cierre de Caja
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 