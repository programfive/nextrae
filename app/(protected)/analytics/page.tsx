import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTrendingUp, IconChartBar, IconCurrencyDollar, IconPackage, IconShoppingCart, IconTruck } from "@tabler/icons-react";
import { Widget } from "@/components/cards/widget";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconTrendingUp className="mr-2 h-4 w-4" />
            Generar Análisis
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          title="Ventas Totales"
          value="$0.00"
          description="Ventas Totales"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Desde el mes pasado"
          footerDescription="Tendencia de ventas mensuales"
        />
        <Widget
          title="Productos Vendidos"
          value="0"
          description="Productos Vendidos"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Desde el mes pasado"
          footerDescription="Cantidad de productos vendidos"
        />
        <Widget
          title="Margen de Ganancia"
          value="0%"
          description="Margen de Ganancia"
          trend={{ value: "+0%", isPositive: true }}
          footerText="Desde el mes pasado"
          footerDescription="Porcentaje de ganancia"
        />
        <Widget
          title="Rotación de Stock"
          value="0"
          description="Rotación de Stock"
          trend={{ value: "0", isPositive: true }}
          footerText="Veces por mes"
          footerDescription="Frecuencia de rotación de inventario"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Análisis de Tendencias</CardTitle>
            <CardDescription>
              Gráficos y métricas de rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No hay datos suficientes para mostrar gráficos
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Métricas Clave</CardTitle>
            <CardDescription>
              Indicadores de rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <IconShoppingCart className="mr-2 h-4 w-4" />
              Análisis de Ventas
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconTruck className="mr-2 h-4 w-4" />
              Análisis de Compras
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconPackage className="mr-2 h-4 w-4" />
              Análisis de Inventario
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconTrendingUp className="mr-2 h-4 w-4" />
              Predicciones
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 