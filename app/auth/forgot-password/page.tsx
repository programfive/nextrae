import { ForgotPasswordForm } from "@/components/forgot-password-form";
import AuthLayout from "@/components/auth/auth-layout";

export default function Page() {
  return (
    <AuthLayout
      title="Restablecer contraseña"
      subtitle="Ingresa tu correo y te enviaremos un enlace para restablecerla."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
