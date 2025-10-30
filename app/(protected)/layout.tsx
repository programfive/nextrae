import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/auth/login");
  }

  // Optionally, you could derive role from claims here.
  const role: "admin" | "librarian" | "user" = "admin";

  return <DashboardLayout role={role}>{children}</DashboardLayout>;
}
