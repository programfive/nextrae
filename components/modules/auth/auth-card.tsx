import { AuthCardHeader } from "@/components/modules/auth/auth-card-header";
import { Social } from "@/components/modules/auth/social";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  props?: React.ComponentPropsWithoutRef<"div">;
  showSocialHeader?: boolean;
}

export function AuthCard({
  title,
  description,
  className,
  children,
  props,
}: AuthCardProps) {
  return (
    <div className={cn(className)} {...props}>
      <Card>
        <AuthCardHeader title={title} description={description} />
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  );
}
