import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconSettings, IconDatabase, IconShield, IconBell, IconPalette } from "@tabler/icons-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconSettings className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Configuración del Sistema</CardTitle>
            <CardDescription>
              Ajusta las configuraciones generales del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconDatabase className="h-6 w-6 mb-2" />
                <span>Base de Datos</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconShield className="h-6 w-6 mb-2" />
                <span>Seguridad</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconBell className="h-6 w-6 mb-2" />
                <span>Notificaciones</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconPalette className="h-6 w-6 mb-2" />
                <span>Apariencia</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Configuraciones comunes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <IconDatabase className="mr-2 h-4 w-4" />
              Respaldo de Datos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconShield className="mr-2 h-4 w-4" />
              Configurar Seguridad
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconBell className="mr-2 h-4 w-4" />
              Notificaciones
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconPalette className="mr-2 h-4 w-4" />
              Tema y Colores
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 