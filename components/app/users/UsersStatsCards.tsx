"use client";

import type { UserListItem, UserStats } from "@/actions/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, Shield, UserCheck, Users } from "lucide-react";

type UsersStatsCardsProps = {
  users: UserListItem[];
  stats: UserStats | null;
};

export function UsersStatsCards({ users, stats }: UsersStatsCardsProps) {
  const cards = [
    {
      label: "Total Usuarios",
      value: (stats?.total ?? users.length).toString(),
      icon: Users,
    },
    {
      label: "Usuarios Activos",
      value: (stats?.active ?? users.length).toString(),
      icon: UserCheck,
    },
    {
      label: "Administradores",
      value:
        (stats?.byRole.admin ?? users.filter((u) => u.role_code === "admin").length).
          toString(),
      icon: Shield,
    },
    {
      label: "Bibliotecarios",
      value:
        (
          stats?.byRole.librarian ??
          users.filter((u) => u.role_code === "librarian").length
        ).toString(),
      icon: Library,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{stat.label}</CardTitle>
            <stat.icon className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
