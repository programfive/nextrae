import Link from "next/link";

import { AuthCard } from "@/components/modules/auth/auth-card";

export default function Page() {
  return (
    <>
      <AuthCard
        title="¡Gracias por registrarte!"
        description="Revisa tu correo para confirmar tu cuenta"
      >
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Te has registrado exitosamente. Por favor revisa tu correo
            electrónico para confirmar tu cuenta antes de iniciar sesión.
          </p>
          <Link
            href="/auth/login"
            className="text-sm underline underline-offset-4 hover:text-primary"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </AuthCard>
    </>
  );
}
