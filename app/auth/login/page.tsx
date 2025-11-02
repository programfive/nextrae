import AuthLayout from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/login-form";

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
