"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { InputPassword } from "@/components/ui/input-password";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updatePasswordSchema } from "../../../schemas";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  type FormValues = z.infer<typeof updatePasswordSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "" },
    mode: "onSubmit",
  });

  const onSubmit = (values: FormValues) => {
    const supabase = createClient();
    startTransition(async () => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        });
        if (error) throw error;
        // El usuario ya tiene una sesión activa
        router.push("/dashboard");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Ocurrió un error";
        // Muestra el error debajo del campo
        form.setError("password", { type: "server", message });
        console.error(error);
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Restablece tu contraseña</CardTitle>
          <CardDescription>
            Por favor, ingresa tu nueva contraseña a continuación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormValues, "password">;
                  }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña</FormLabel>
                      <FormControl>
                        <InputPassword
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Guardando..." : "Guardar nueva contraseña"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
