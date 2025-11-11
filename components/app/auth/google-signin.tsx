"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/google";
import { useState } from "react";

export function GoogleSignInButton({ label = "Google" }: { label?: string }) {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback?next=/dashboard`
              : undefined,
          queryParams: {
            prompt: "consent",
            hd: "unibeth.edu.bo",
          },
        },
      });
      if (error) throw error;
    } catch {
      // no-op: error surfaces in Supabase redirect flow or network console
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" className="w-full" onClick={onClick} disabled={loading}>
      <GoogleIcon className="mr-2 h-4 w-4" aria-hidden="true" />
      {loading ? "Redirigiendo..." : label}
    </Button>
  );
}
