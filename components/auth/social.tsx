"use client";

import { SocialButton } from "@/components/auth/social-button";
import { GithubIcon } from "@/components/icons/github";
import { GoogleIcon } from "@/components/icons/google";
import { Separator } from "@/components/ui/separator";
export function Social() {
  return (
    <>
      <div className="relative ">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            o continúa con
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <SocialButton Icon={GoogleIcon} label="Google" />
        <SocialButton Icon={GithubIcon} label="GitHub" />
      </div>
    </>
  );
}
