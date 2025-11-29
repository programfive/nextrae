"use client";

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
import { cn } from "@/lib/utils";
import { loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getUserByEmail, isVerifyPassword } from '../../../actions/auth';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  type FormValues = z.infer<typeof loginSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const { data: userData } = await getUserByEmail(values.email);
        if (!userData || userData.length === 0) {
          form.setError("email", {
            type: "server",
            message: "Email no registrado",
          });
          return;
        }

        const { error } = await isVerifyPassword(values.email, values.password);
        if (error) {
          form.setError("password", {
            type: "server",
            message: "Contraseña incorrecta",
          });
          return;
        }

        router.push("/dashboard");
      } catch (error: unknown) {
        console.error(error);
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "email">;
              }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input type="email" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "password">;
              }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Contraseña</FormLabel>
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <FormControl>
                    <InputPassword disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isPending ? "Ingresando..." : "Iniciar sesión con email"}
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
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/sign-up" className="underline underline-offset-4">
              Crear cuenta
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
