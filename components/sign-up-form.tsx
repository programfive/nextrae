"use client";

import { GoogleSignInButton } from "@/components/auth/google-signin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { signUpSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  type FormValues = z.infer<typeof signUpSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", repeatPassword: "" },
    mode: "onSubmit",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setError(null);

    const valid = await form.trigger();
    if (!valid) return;

    try {
      const { email, password } = form.getValues();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSignUp}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              required
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="repeat-password">Repetir contraseña</Label>
            </div>
            <Input
              id="repeat-password"
              type="password"
              required
              {...form.register("repeatPassword")}
            />
            {form.formState.errors.repeatPassword && (
              <p className="text-sm text-red-500">
                {form.formState.errors.repeatPassword.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creando cuenta..."
              : "Crear cuenta con email"}
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
    </div>
  );
}
