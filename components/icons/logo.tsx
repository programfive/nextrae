import { cn } from "@/lib/utils";

export function Logo({
  className,
  props,
}: {
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      {...props}
      className={cn(
        " rounded-full text-xl font-bold text-foreground p-2",
        className
      )}
    >
      Nextrae
    </div>
  );
}
