"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface LogoutButtonProps {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export function LogoutButton({ 
  children, 
  className, 
  variant = "default",
  size = "default",
  asChild = false 
}: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button 
      onClick={logout} 
      className={className}
      variant={variant}
      size={size}
      asChild={asChild}
    >
      {children}
    </Button>
  );
}
