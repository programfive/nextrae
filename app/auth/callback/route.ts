import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code !== null) {
    const supabase = await createClient();
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    } else {
      // console.error("Session Exchange Error:", exchangeError);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=session_error`
      );
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}
