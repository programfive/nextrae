import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconClipboardList, IconHistory, IconFileText, IconAlertTriangle } from "@tabler/icons-react";

export default function AuditPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Auditoría</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconClipboardList className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros</CardTitle>
            <IconClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total de registros
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoy</CardTitle>
            <IconHistory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Registros de hoy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Alertas activas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <IconClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Usuarios auditados
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Módulos de Auditoría</CardTitle>
            <CardDescription>
              Accede a los diferentes tipos de auditoría del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col justify-center" asChild>
                <a href="/audit/history">
                  <IconHistory className="h-6 w-6 mb-2" />
                  <span>Historial</span>
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center" asChild>
                <a href="/audit/logs">
                  <IconFileText className="h-6 w-6 mb-2" />
                  <span>Logs</span>
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconAlertTriangle className="h-6 w-6 mb-2" />
                <span>Alertas</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconClipboardList className="h-6 w-6 mb-2" />
                <span>Reportes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Operaciones de auditoría
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <IconHistory className="mr-2 h-4 w-4" />
              Ver Historial
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconFileText className="mr-2 h-4 w-4" />
              Exportar Logs
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconAlertTriangle className="mr-2 h-4 w-4" />
              Configurar Alertas
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconClipboardList className="mr-2 h-4 w-4" />
              Generar Reporte
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 