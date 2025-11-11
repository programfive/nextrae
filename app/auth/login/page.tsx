import AuthLayout from "@/components/app/auth/auth-layout";
import { LoginForm } from "@/components/app/auth/login-form";

export default function Page() {
  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión con tu cuenta para continuar"
    >
      <LoginForm />
    </AuthLayout>
  );
}
