"use client";

import type { RoleCode, UserListItem } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Mail, MoreHorizontal, Trash2 } from "lucide-react";

type UsersTableProps = {
  users: UserListItem[];
  onEditUser: (user: UserListItem) => void;
};

const getRoleBadge = (role: RoleCode) => {
  switch (role) {
    case "administrador":
      return <Badge>Administrador</Badge>;
    case "bibliotecario":
      return <Badge variant="secondary">Bibliotecario</Badge>;
    case "usuario":
      return <Badge variant="outline">Estudiante</Badge>;
    default:
      return <Badge>{role}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  if (status === "activo") {
    return <Badge variant="secondary">Activo</Badge>;
  }
  return <Badge variant="secondary">Inactivo</Badge>;
};

const getEmailVerifiedBadge = (confirmed: boolean) => {
  if (confirmed) {
    return <Badge>Confirmado</Badge>;
  }
  return <Badge variant="secondary">Pendiente</Badge>;
};

export function UsersTable({ users, onEditUser }: UsersTableProps) {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Verificación</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Carrera</TableHead>
          <TableHead>Préstamos</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.user_id}>
            <TableCell>{user.full_name}</TableCell>
            <TableCell className="text-muted-foreground">
              {user.email}
            </TableCell>
            <TableCell>{getEmailVerifiedBadge(user.email_confirmed)}</TableCell>
            <TableCell>{getRoleBadge(user.role_code)}</TableCell>
            <TableCell className="text-muted-foreground">
              {/* carrera pendiente de modelar */}
            </TableCell>
            <TableCell>{user.loans_count}</TableCell>
            <TableCell>{getStatusBadge("activo")}</TableCell>
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
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
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
  );
}
