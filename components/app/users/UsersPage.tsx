"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";

const mockUsers = [
  {
    id: 1,
    name: "Juan Pérez López",
    email: "juan.perez@unibeth.edu.bo",
    role: "user",
    status: "activo",
    carrera: "Ingeniería en Sistemas",
    loans: 2,
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "María García Mendoza",
    email: "maria.garcia@unibeth.edu.bo",
    role: "user",
    status: "activo",
    carrera: "Administración de Empresas",
    loans: 1,
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Carlos López Quispe",
    email: "bibliotecario@unibeth.edu.bo",
    role: "librarian",
    status: "activo",
    carrera: "N/A",
    loans: 0,
    joinDate: "2023-08-10",
  },
  {
    id: 4,
    name: "Ana Martínez",
    email: "ana.martinez@unibeth.edu.bo",
    role: "user",
    status: "inactivo",
    carrera: "Contaduría Pública",
    loans: 0,
    joinDate: "2024-03-05",
  },
  {
    id: 5,
    name: "Pedro Admin",
    email: "admin@unibeth.edu.bo",
    role: "admin",
    status: "activo",
    carrera: "N/A",
    loans: 0,
    joinDate: "2023-06-01",
  },
];

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    (typeof mockUsers)[0] | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.carrera.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-primary">
            <Shield className="mr-1 h-3 w-3" />
            Administrador
          </Badge>
        );
      case "librarian":
        return (
          <Badge className="bg-accent">
            <Shield className="mr-1 h-3 w-3" />
            Bibliotecario
          </Badge>
        );
      case "user":
        return <Badge variant="outline">Estudiante</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "activo") {
      return <Badge className="bg-accent">Activo</Badge>;
    }
    return <Badge variant="secondary">Inactivo</Badge>;
  };

  const handleEditUser = (user: (typeof mockUsers)[0]) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setShowDialog(true);
  };

  const stats = [
    {
      label: "Total Usuarios",
      value: mockUsers.length.toString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Usuarios Activos",
      value: mockUsers.filter((u) => u.status === "activo").length.toString(),
      icon: Users,
      color: "text-green-600",
    },
    {
      label: "Administradores",
      value: mockUsers.filter((u) => u.role === "admin").length.toString(),
      icon: Shield,
      color: "text-orange-600",
    },
    {
      label: "Bibliotecarios",
      value: mockUsers.filter((u) => u.role === "librarian").length.toString(),
      icon: Shield,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p className="text-muted-foreground">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o carrera..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="librarian">Bibliotecarios</SelectItem>
                  <SelectItem value="user">Estudiantes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuario(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead>Préstamos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.carrera}
                  </TableCell>
                  <TableCell>{user.loans}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3>No se encontraron usuarios</h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de edición/creación */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Actualiza la información del usuario"
                : "Crea un nuevo usuario en el sistema"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre Completo</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedUser?.name || ""}
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Institucional</Label>
                <Input
                  id="edit-email"
                  type="email"
                  defaultValue={selectedUser?.email || ""}
                  placeholder="usuario@unibeth.edu.bo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Rol</Label>
                <Select defaultValue={selectedUser?.role || "user"}>
                  <SelectTrigger id="edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Estudiante</SelectItem>
                    <SelectItem value="librarian">Bibliotecario</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select defaultValue={selectedUser?.status || "activo"}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-carrera">Carrera</Label>
                <Input
                  id="edit-carrera"
                  defaultValue={selectedUser?.carrera || ""}
                  placeholder="Ingeniería en Sistemas"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowDialog(false)}>
              {isEditing ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
