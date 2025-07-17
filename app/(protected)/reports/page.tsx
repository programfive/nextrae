import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconReport, IconDownload, IconChartBar, IconTrendingUp, IconPackage, IconShoppingCart, IconTruck } from "@tabler/icons-react";
import { Widget } from "@/components/cards/widget";

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconDownload className="mr-2 h-4 w-4" />
            Exportar Reporte
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          title="Reportes Generados"
          value="0"
          description="Reportes Generados"
          trend={{ value: "0", isPositive: true }}
          footerText="Reportes disponibles"
          footerDescription="Total de reportes generados"
        />
        <Widget
          title="Ventas Mensuales"
          value="$0.00"
          description="Ventas Mensuales"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Ingresos del mes"
          footerDescription="Ventas totales del mes actual"
        />
        <Widget
          title="Stock Crítico"
          value="0"
          description="Stock Crítico"
          trend={{ value: "0", isPositive: false }}
          footerText="Productos con bajo stock"
          footerDescription="Productos que requieren reabastecimiento"
        />
        <Widget
          title="Compras Pendientes"
          value="0"
          description="Compras Pendientes"
          trend={{ value: "0", isPositive: false }}
          footerText="Órdenes pendientes"
          footerDescription="Compras en proceso de entrega"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Reportes Disponibles</CardTitle>
            <CardDescription>
              Selecciona el tipo de reporte que necesitas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconShoppingCart className="h-6 w-6 mb-2" />
                <span>Reporte de Ventas</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconTruck className="h-6 w-6 mb-2" />
                <span>Reporte de Compras</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconPackage className="h-6 w-6 mb-2" />
                <span>Reporte de Inventario</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconChartBar className="h-6 w-6 mb-2" />
                <span>Reporte Financiero</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Generar reportes comunes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <IconDownload className="mr-2 h-4 w-4" />
              Exportar a Excel
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconDownload className="mr-2 h-4 w-4" />
              Exportar a PDF
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconChartBar className="mr-2 h-4 w-4" />
              Gráficos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconTrendingUp className="mr-2 h-4 w-4" />
              Análisis de Tendencias
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 