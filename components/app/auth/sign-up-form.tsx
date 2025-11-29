"use client";

import { isEmailAvailable, isFullNameAvailable } from "@/actions/auth";
import { GoogleSignInButton } from "@/components/app/auth/google-signin";
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
import { InputPassword } from "@/components/ui/input-password";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { signUpSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  type FormValues = z.infer<typeof signUpSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
    mode: "onSubmit",
  });

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setError(null);

    startTransition(async () => {
      const valid = await form.trigger();
      if (!valid) return;

      try {
        const { fullName, email, password } = form.getValues();

        const availableFullName = await isFullNameAvailable(fullName);
        if (!availableFullName) {
          form.setError("fullName", {
            type: "server",
            message: "Este nombre ya está registrado",
          });
          return;
        }

        const availableEmail = await isEmailAvailable(email);
        if (!availableEmail) {
          form.setError("email", {
            type: "server",
            message: "Este correo ya está registrado",
          });
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        router.push("/auth/sign-up-success");
      } catch (error: unknown) {
        console.log(error);
        setError(error instanceof Error ? error.message : "Ocurrió un error");
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSignUp}>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      disabled={isPending}
                      {...field}
                    />
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
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      required
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <InputPassword
                      required
                      disabled={isPending}
                      {...field}
                    />
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
                  <FormLabel>Repetir contraseña</FormLabel>
                  <FormControl>
                    <InputPassword
                      required
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isPending ? "Creando cuenta" : "Crear cuenta con email"}
            </Button>
            <div className=" flex items-center gap-4 w-full">
              <span className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">
                O continúa con
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <GoogleSignInButton />
          </div>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Iniciar sesión
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
