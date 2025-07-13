"use client";

import { IconLoader } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <AuthCard
          title="Revisa tu correo"
          description="Instrucciones de restablecimiento enviadas"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Si te registraste con tu correo electrónico y contraseña,
              recibirás un email para restablecer tu contraseña.
            </p>
            <Link
              href="/auth/login"
              className="text-sm underline underline-offset-4 hover:text-primary"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </AuthCard>
      ) : (
        <AuthCard
          title="Restablecer contraseña"
          description="Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"
        >
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <IconLoader className="animate-spin w-6 h-6 mr-2" />
                )}
                {isLoading ? "Enviando..." : "Enviar email de restablecimiento"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="underline underline-offset-4 ml-1"
              >
                Iniciar sesión
              </Link>
            </div>
          </form>
        </AuthCard>
      )}
    </div>
  );
}
