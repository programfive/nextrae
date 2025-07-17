import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSearch, IconPackage, IconShoppingCart, IconTruck, IconUsers } from "@tabler/icons-react";

export default function SearchPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Búsqueda</h2>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Búsqueda Global</CardTitle>
            <CardDescription>
              Busca en todos los módulos del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                placeholder="Buscar productos, ventas, compras, usuarios..." 
                className="flex-1"
              />
              <Button>
                <IconSearch className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
            <div className="text-center py-8 text-muted-foreground">
              Ingresa un término de búsqueda para comenzar
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Búsquedas Rápidas</CardTitle>
            <CardDescription>
              Acceso directo a módulos específicos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <IconPackage className="mr-2 h-4 w-4" />
              Buscar Productos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconShoppingCart className="mr-2 h-4 w-4" />
              Buscar Ventas
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconTruck className="mr-2 h-4 w-4" />
              Buscar Compras
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconUsers className="mr-2 h-4 w-4" />
              Buscar Usuarios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 