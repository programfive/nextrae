"use client";

import { ReactNode, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Home,
  Search,
  BookMarked,
  Calendar,
  FileText,
  User,
  Settings,
  LogOut,
  BarChart3,
  Users,
  Database,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: "admin" | "librarian" | "user";
  userName?: string;
}

export function DashboardLayout({
  children,
  role = "admin",
  userName = "Usuario",
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const userMenuItems = [
    { href: "/dashboard", label: "Inicio", icon: Home },
    { href: "/catalog", label: "Catálogo", icon: Search },
    { href: "/loans", label: "Mis Préstamos", icon: BookMarked },
    { href: "/reservations", label: "Mis Reservas", icon: Calendar },
    { href: "/digital", label: "Materiales Digitales", icon: FileText },
  ];

  const librarianMenuItems = [
    { href: "/dashboard", label: "Inicio", icon: Home },
    { href: "/catalog", label: "Catálogo", icon: Search },
    { href: "/loans", label: "Gestión Préstamos", icon: BookMarked },
    { href: "/reservations", label: "Gestión Reservas", icon: Calendar },
    { href: "/digital", label: "Materiales Digitales", icon: FileText },
    { href: "/reports", label: "Reportes", icon: BarChart3 },
  ];

  const adminMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/catalog", label: "Catálogo", icon: Search },
    { href: "/loans", label: "Gestión Préstamos", icon: BookMarked },
    { href: "/reservations", label: "Gestión Reservas", icon: Calendar },
    { href: "/digital", label: "Materiales Digitales", icon: FileText },
    { href: "/users", label: "Usuarios", icon: Users },
    { href: "/reports", label: "Reportes", icon: BarChart3 },
    { href: "/settings", label: "Configuración", icon: Settings },
    { href: "/backup", label: "Respaldo BD", icon: Database },
  ];

  const menuItems =
    role === "admin" ? adminMenuItems : role === "librarian" ? librarianMenuItems : userMenuItems;

  const getRoleName = () => {
    if (role === "admin") return "Administrador";
    if (role === "librarian") return "Bibliotecario";
    return "Usuario";
  };

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }, [router]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary">
                <BookOpen className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sidebar-foreground">UNIBETH</h2>
                <p className="text-xs text-sidebar-foreground/70">Biblioteca</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navegación</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                        <Link href={item.href}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Cuenta</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/profile")}>
                      <Link href="/profile">
                        <User className="w-4 h-4" />
                        <span>Mi Perfil</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-sidebar-foreground truncate">{userName}</p>
                <p className="text-xs text-sidebar-foreground/70 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {getRoleName()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border hover:bg-sidebar-accent/80"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background px-6 py-4 flex items-center gap-4">
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
