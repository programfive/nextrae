"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-background  flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Card className="w-full max-w-sm gap-1">
        {(title || subtitle) && (
          <CardHeader>
            <div className="flex text-center items-start justify-between">
              <div className="w-full">
                {title && <CardTitle className=' text-2xl'>{title}</CardTitle>}
                {subtitle && <CardDescription>{subtitle}</CardDescription>}
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
