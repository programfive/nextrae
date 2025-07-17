import { AppSidebar } from "@/components/aside/app-sidebar";
import { SiteHeader } from "@/components/aside/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
interface ProtectedLayoutProps {
  children: React.ReactNode;
}
export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}