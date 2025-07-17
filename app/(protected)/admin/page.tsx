import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconShield, IconUsers, IconUserCheck, IconKey } from "@tabler/icons-react";

export default function AdminPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Administración</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconShield className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <IconUserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Roles definidos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permisos</CardTitle>
            <IconKey className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Permisos configurados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <IconShield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Usuarios activos
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Módulos de Administración</CardTitle>
            <CardDescription>
              Gestiona usuarios, roles y permisos del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col justify-center" asChild>
                <a href="/admin/users">
                  <IconUsers className="h-6 w-6 mb-2" />
                  <span>Usuarios</span>
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center" asChild>
                <a href="/admin/roles">
                  <IconUserCheck className="h-6 w-6 mb-2" />
                  <span>Roles</span>
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center" asChild>
                <a href="/admin/permissions">
                  <IconKey className="h-6 w-6 mb-2" />
                  <span>Permisos</span>
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconShield className="h-6 w-6 mb-2" />
                <span>Configuración</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Operaciones de administración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <IconUsers className="mr-2 h-4 w-4" />
              Crear Usuario
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconUserCheck className="mr-2 h-4 w-4" />
              Asignar Roles
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconKey className="mr-2 h-4 w-4" />
              Gestionar Permisos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconShield className="mr-2 h-4 w-4" />
              Configuración del Sistema
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 