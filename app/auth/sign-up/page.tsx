import { SignUpForm } from "@/components/sign-up-form";
import AuthLayout from "@/components/auth/auth-layout";

export default function Page() {
  return (
    <AuthLayout title="Crear cuenta" subtitle="Registra tu cuenta para continuar">
      <SignUpForm />
    </AuthLayout>
  );
}
