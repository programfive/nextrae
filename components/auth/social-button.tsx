"use client";
import { Provider } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface SocialButtonProps {
  Icon: React.ElementType;
  label: string;
}
export function SocialButton({ Icon, label }: SocialButtonProps) {
  const supabase = createClient();
  const onProviderClick = async (provider: string) => {
    await supabase.auth.signInWithOAuth({
      provider: provider.toLowerCase() as Provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => onProviderClick(label)}
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </>
  );
}
