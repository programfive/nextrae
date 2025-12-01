"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  TrendingUp,
  User,
} from "lucide-react";
import { useState } from "react";

interface ProfilePageProps {
  role: "admin" | "librarian" | "user";
}

export function ProfilePage({ role }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Usuario UNIBETH",
    email: "usuario@unibeth.edu.bo",
    phone: "+591 123 456 789",
    address: "La Paz, Bolivia",
    carrera: "Ingeniería en Sistemas",
  });

  const getRoleName = () => {
    if (role === "admin") return "Administrador";
    if (role === "librarian") return "Bibliotecario";
    return "Estudiante";
  };

  const userStats = [
    { label: "Préstamos Totales", value: "12", icon: BookOpen },
    { label: "Descargas", value: "8", icon: TrendingUp },
    { label: "Días Activo", value: "45", icon: Calendar },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Aquí iría la lógica para guardar los cambios
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Mi Perfil</h2>
        <p className="text-muted-foreground">
          Administra tu información personal y preferencias
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Información básica */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tus datos de contacto
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              ) : (
                <Button size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {formData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Cambiar Foto
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Institucional</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                {role === "user" && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="carrera">Carrera</Label>
                    <Input
                      id="carrera"
                      value={formData.carrera}
                      onChange={(e) =>
                        setFormData({ ...formData, carrera: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>
                Gestiona tu contraseña y seguridad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                Cambiar Contraseña
              </Button>
              <Separator />
              <div className="space-y-2">
                <h4>Sesiones Activas</h4>
                <div className="text-sm text-muted-foreground">
                  <p>• Navegador Web - Activa ahora</p>
                  <p>• Aplicación Móvil - Hace 2 horas</p>
                </div>
                <Button variant="outline" size="sm">
                  Cerrar Todas las Sesiones
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información de la cuenta */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rol</span>
                  <Badge>
                    <Shield className="mr-1 h-3 w-3" />
                    {getRoleName()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    ID Usuario
                  </span>
                  <span className="text-sm">UNI-2024-001</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Miembro desde
                  </span>
                  <span className="text-sm">Octubre 2024</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <Badge variant="secondary">Activo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-xl">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Notificaciones por Email</span>
                <Badge variant="secondary">Activo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Recordatorios</span>
                <Badge variant="secondary">Activo</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Configurar Preferencias
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
