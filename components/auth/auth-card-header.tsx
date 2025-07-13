"use client";

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AuthCardHeaderProps {
  title: string;
  description?: string;
}

export function AuthCardHeader({ title, description }: AuthCardHeaderProps) {
  return (
    <CardHeader className="space-y-2 text-center">
      <CardTitle className="text-2xl font-bold text-foreground">
        {title}
      </CardTitle>
      {description && (
        <CardDescription className="text-muted-foreground mt-2 ">
          {description}
        </CardDescription>
      )}
    </CardHeader>
  );
}
