"use client";
import { isEmailAvailable, isFullNameAvailable } from "@/actions/auth";
import type { RoleCode, UserListItem, UserStats } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { userDialogSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UsersFilters } from "./UsersFilters";
import { UsersStatsCards } from "./UsersStatsCards";
import { UsersTable } from "./UsersTable";

type UsersPageProps = {
  users: UserListItem[];
  stats: UserStats | null;
  createUserAction: (formData: FormData) => Promise<unknown>;
  updateUserAction: (formData: FormData) => Promise<unknown>;
};

export function UsersPage(props: UsersPageProps) {
  const { users, stats } = props;
  const router = useRouter();
  const [localUsers, setLocalUsers] = useState<UserListItem[]>(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formRole, setFormRole] = useState<RoleCode>("user");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  type UserDialogFormValues = z.infer<typeof userDialogSchema>;

  const form = useForm<UserDialogFormValues>({
    resolver: zodResolver(userDialogSchema),
    defaultValues: {
      full_name: "",
      email: "",
      career_id: "",
      password: "",
      repeatPassword: "",
    },
  });

  const [careers, setCareers] = useState<{ id: string; name: string; code: string }[]>([]);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  useEffect(() => {
    const fetchCareers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("careers")
        .select("id, name, code")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading careers", error);
        return;
      }

      setCareers(data ?? []);
    };

    fetchCareers();
  }, []);

  const filteredUsers = localUsers.filter((user) => {
    const carrera = ""; // pendiente de modelar en BD
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrera.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role_code === (roleFilter as RoleCode);

    return matchesSearch && matchesRole;
  });

  const handleEditUser = (user: UserListItem) => {
    setSelectedUser(user);
    setIsEditing(true);
    setFormRole(user.role_code);
    setCurrentStep(1);
    form.reset({
      full_name: user.full_name,
      email: user.email,
      career_id: "",
      password: "",
      repeatPassword: "",
    });
    setShowDialog(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setFormRole("user");
    setCurrentStep(1);
    form.reset({
      full_name: "",
      email: "",
      career_id: "",
      password: "",
      repeatPassword: "",
    });
    setShowDialog(true);
  };

  const handleCreateUser = async (values: UserDialogFormValues) => {
    const full_name = values.full_name.trim();
    const email = values.email.trim();
    const career_id = values.career_id?.trim() ?? "";
    const password = values.password ?? "";
    const repeatPassword = values.repeatPassword ?? "";

    if (!full_name || !email || !password || !repeatPassword) {
      toast.error("Nombre, email y ambas contraseñas son obligatorios");
      return;
    }

    if (password !== repeatPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    const supabase = createClient();

    await toast.promise(
      (async () => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name,
            },
          },
        });

        if (authError) {
          throw new Error(authError.message);
        }

        const userId = authData?.user?.id;
        if (!userId) {
          throw new Error("No se pudo obtener el ID del usuario creado");
        }

        const { data: roleRow, error: roleError } = await supabase
          .from("roles")
          .select("id")
          .eq("code", formRole)
          .maybeSingle();

        if (roleError || !roleRow?.id) {
          throw new Error("No se pudo obtener el rol seleccionado");
        }

        const payload: Record<string, unknown> = {
          user_id: userId,
          full_name,
          email,
          role_id: roleRow.id,
        };

        if (career_id) {
          payload.career_id = career_id;
        }

        const { error: userError } = await supabase
          .from("users")
          .upsert(payload, { onConflict: "user_id" });

        if (userError) {
          throw new Error(userError.message);
        }
      })(),
      {
        loading: "Registrando usuario...",
        success:
          "El usuario se creó correctamente. Revisa el correo institucional para confirmar la cuenta y continuar.",
        error: (err) => err.message || "Error al registrar usuario",
      }
    );

    router.refresh();
    setShowDialog(false);
    setCurrentStep(1);
    form.reset({
      full_name: "",
      email: "",
      career_id: "",
      password: "",
      repeatPassword: "",
    });
  };

  const handleNextStep = async () => {
    if (isEditing) return;

    if (currentStep === 1) {
      const valid = await form.trigger(["full_name", "email"]);
      if (!valid) return;
      const values = form.getValues();
      const full_name = values.full_name.trim();
      const email = values.email.trim();

      const [availableFullName, availableEmail] = await Promise.all([
        isFullNameAvailable(full_name),
        isEmailAvailable(email),
      ]);

      if (!availableFullName) {
        form.setError("full_name", {
          type: "server",
          message: "Este nombre ya está registrado",
        });
      }

      if (!availableEmail) {
        form.setError("email", {
          type: "server",
          message: "Este correo ya está registrado",
        });
      }

      if (!availableFullName || !availableEmail) {
        toast.error(
          "Revisa los campos marcados. Ya existe un usuario con esos datos."
        );
        return;
      }

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const valid = await form.trigger(["password", "repeatPassword"]);
      if (!valid) return;
      setCurrentStep(3);
      return;
    }
  };

  const handlePrevStep = () => {
    if (isEditing) return;
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  };

  const handleUpdateUser = async (values: UserDialogFormValues) => {
    if (!selectedUser) return;

    const full_name = values.full_name.trim();
    const email = values.email.trim();
    const career_id = values.career_id?.trim() ?? "";

    const supabase = createClient();

    await toast.promise(
      (async () => {
        const { data: roleRow, error: roleError } = await supabase
          .from("roles")
          .select("id")
          .eq("code", formRole)
          .maybeSingle();

        if (roleError || !roleRow?.id) {
          throw new Error("No se pudo obtener el rol seleccionado");
        }

        const payload: Record<string, unknown> = {
          full_name,
          email,
          role_id: roleRow.id,
        };

        if (career_id) {
          payload.career_id = career_id;
        }

        const { error: userError } = await supabase
          .from("users")
          .update(payload)
          .eq("user_id", selectedUser.user_id);

        if (userError) {
          throw new Error(userError.message);
        }
      })(),
      {
        loading: "Actualizando usuario...",
        success: "Usuario actualizado correctamente",
        error: (err) => err.message || "Error al actualizar usuario",
      }
    );

    setShowDialog(false);
    router.refresh();
  };

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
      <UsersStatsCards users={users} stats={stats} />

      {/* Filtros */}
      <UsersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuario(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={filteredUsers} onEditUser={handleEditUser} />

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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar usuario" : "Nuevo usuario"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Actualiza los datos del usuario seleccionado."
                : "Completa los pasos para registrar un nuevo usuario."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                isEditing ? handleUpdateUser : handleCreateUser
              )}
              className="space-y-6"
            >
            {currentStep === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Nombre completo</Label>
                      <FormControl>
                        <Input placeholder="Nombre y apellidos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Correo institucional</Label>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="correo@institucion.edu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="career_id"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Carrera (opcional)</Label>
                        <FormControl>
                          <Combobox
                            items={careers.map((career) => ({
                              label: career.name,
                              value: career.id,
                            }))}
                            value={field.value || ""}
                            onChange={(value) => field.onChange(value)}
                            placeholder="Selecciona una carrera"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <Label>Rol</Label>
                    <FormControl>
                      <Select
                        value={formRole}
                        onValueChange={(value) =>
                          setFormRole(value as RoleCode)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuario</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </div>
              </div>
            )}

            {!isEditing && currentStep === 2 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Contraseña</Label>
                      <FormControl>
                        <InputPassword {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Repite la contraseña</Label>
                      <FormControl>
                        <InputPassword {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {!isEditing && currentStep === 3 && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Revisa que los datos ingresados sean correctos.</p>
              </div>
            )}

              <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <div className="flex gap-2">
                  {!isEditing && currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                    >
                      Atrás
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                  >
                    Cancelar
                  </Button>
                  {isEditing ? (
                    <Button type="submit">Guardar cambios</Button>
                  ) : currentStep < 3 ? (
                    <Button type="button" onClick={handleNextStep}>
                      Siguiente
                    </Button>
                  ) : (
                    <Button type="submit">Crear usuario</Button>
                  )}
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
