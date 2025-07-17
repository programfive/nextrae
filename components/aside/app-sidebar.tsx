"use client";

import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconPackage,
  IconShoppingCart,
  IconTruck,
  IconBox,
  IconArchive,
  IconShield,
  IconClipboardList,
  IconAlertTriangle,
  IconTrendingUp,
  IconBuildingStore,
} from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "@/components/aside/nav-documents";
import { NavMain } from "@/components/aside/nav-main";
import { NavSecondary } from "@/components/aside/nav-secondary";
import { NavUser } from "@/components/aside/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Productos",
      url: "/products",
      icon: IconPackage,
    },
    {
      title: "Categorías",
      url: "/categories",
      icon: IconFolder,
    },
    {
      title: "Inventario",
      url: "/inventory",
      icon: IconBox,
    },
    {
      title: "Compras",
      url: "/purchases",
      icon: IconTruck,
    },
    {
      title: "Ventas",
      url: "/sales",
      icon: IconShoppingCart,
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: IconReport,
    },
  ],
  navClouds: [
    {
      title: "Gestión de Inventario",
      icon: IconArchive,
      isActive: true,
      url: "/inventory-management",
      items: [
        {
          title: "Movimientos",
          url: "/inventory/movements",
        },
        {
          title: "Lotes",
          url: "/inventory/batches",
        },
        {
          title: "Mermas",
          url: "/inventory/wastes",
        },
      ],
    },
    {
      title: "Administración",
      icon: IconShield,
      url: "/admin",
      items: [
        {
          title: "Usuarios",
          url: "/admin/users",
        },
        {
          title: "Roles",
          url: "/admin/roles",
        },
        {
          title: "Permisos",
          url: "/admin/permissions",
        },
      ],
    },
    {
      title: "Auditoría",
      icon: IconClipboardList,
      url: "/audit",
      items: [
        {
          title: "Historial",
          url: "/audit/history",
        },
        {
          title: "Logs",
          url: "/audit/logs",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Ayuda",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Buscar",
      url: "/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Analytics",
      url: "/analytics",
      icon: IconTrendingUp,
    },
    {
      name: "Reportes",
      url: "/reports",
      icon: IconReport,
    },
    {
      name: "Tienda",
      url: "/store",
      icon: IconBuildingStore,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useAuth();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Nextrae</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} isLoading={loading} />
      </SidebarFooter>
    </Sidebar>
  );
}
