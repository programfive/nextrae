"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getUserByEmail } from '@/actions/auth';

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  type FormValues = z.infer<typeof forgotPasswordSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { data: userData } = await getUserByEmail(values.email);
        if (!userData || userData.length === 0) {
          form.setError("email", {
            type: "server",
            message: "El correo no está registrado",
          });
          return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(
          values.email,
          {
            redirectTo: `${window.location.origin}/auth/update-password`,
          }
        );
        if (error) throw error;
        setSuccess(true);
      } catch (error: unknown) {
        console.error(error);
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-center">Revisa tu correo</h2>
          <p className="text-sm text-muted-foreground">
            Te enviamos instrucciones para restablecer tu contraseña.
          </p>
          <p className="text-sm text-muted-foreground">
            Si no lo encuentras, revisa la carpeta de spam.
          </p>
          <div className="mt-4">
            <Link
              href="/auth/login"
              className="underline underline-offset-4 text-sm"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-2xl font-semibold">Recuperar contraseña</h2>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input type="email" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {isPending
                    ? "Enviando..."
                    : "Enviar correo de restablecimiento"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Iniciar sesión
                </Link>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
