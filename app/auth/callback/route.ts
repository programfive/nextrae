import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const oauthError = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (oauthError || errorDescription) {
    return redirect(`/auth/error?error=${encodeURIComponent(errorDescription || oauthError || "OAuth error")}`);
  }

  if (!code) {
    return redirect(`/auth/error?error=${encodeURIComponent("No OAuth code provided")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
  }

  return redirect(next);
}
