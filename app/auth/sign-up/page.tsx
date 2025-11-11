import AuthLayout from "@/components/app/auth/auth-layout";
import { SignUpForm } from "@/components/app/auth/sign-up-form";

export default function Page() {
  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Registra tu cuenta para continuar"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
