"use client";

import { IconLoader } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { Social } from "@/components/auth/social";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard
        title="Bienvenido de nuevo"
        description="Ingresa tus credenciales para acceder a tu cuenta"
        showSocialHeader
      >
        <form onSubmit={handleLogin} className="mb-6">
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
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <IconLoader className="animate-spin w-6 h-6 mr-2" />
              )}
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </div>
        </form>
        <Social />
        <div className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?
          <Link
            href="/auth/sign-up"
            className="underline underline-offset-4 ml-1"
          >
            Registrarse
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
