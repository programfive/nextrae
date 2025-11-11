import AuthLayout from "@/components/app/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/app/auth/forgot-password-form";

export default function Page() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
