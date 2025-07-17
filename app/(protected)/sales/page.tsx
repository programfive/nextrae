import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus, IconShoppingCart, IconCurrencyDollar, IconCalendar, IconUsers } from "@tabler/icons-react";
import { Widget } from "@/components/cards/widget";

export default function SalesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Ventas</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            Nueva Venta
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          title="Total Ventas"
          value="0"
          description="Total Ventas"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Ventas realizadas"
          footerDescription="Total de ventas completadas"
        />
        <Widget
          title="Ingresos"
          value="$0.00"
          description="Ingresos"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Ingresos totales"
          footerDescription="Ingresos generados por ventas"
        />
        <Widget
          title="Este Mes"
          value="0"
          description="Este Mes"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Ventas del mes"
          footerDescription="Ventas realizadas este mes"
        />
        <Widget
          title="Clientes"
          value="0"
          description="Clientes"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Clientes activos"
          footerDescription="Número de clientes activos"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Historial de Ventas</CardTitle>
            <CardDescription>
              Lista de todas las ventas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No hay ventas registradas aún
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Operaciones de ventas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <IconPlus className="mr-2 h-4 w-4" />
              Nueva Venta
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconUsers className="mr-2 h-4 w-4" />
              Gestionar Clientes
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconCurrencyDollar className="mr-2 h-4 w-4" />
              Reporte de Ventas
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconCalendar className="mr-2 h-4 w-4" />
              Calendario de Ventas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 