import AuthLayout from "@/components/layout/auth";

interface AuthLayoutPageProps {
  children: React.ReactNode;
}
export default function AuthLayoutPage({ children }: AuthLayoutPageProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
