"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, BookOpen, TrendingUp, Calendar, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const statsData = [
  { label: "Total Usuarios", value: "1,234", change: "+12%", icon: Users },
  { label: "Préstamos Activos", value: "456", change: "+8%", icon: BookOpen },
  { label: "Reservas Pendientes", value: "89", change: "+5%", icon: Calendar },
  { label: "Descargas Digitales", value: "2,345", change: "+23%", icon: Download },
];

const loansByMonth = [
  { mes: "Ene", prestamos: 65, devoluciones: 58 },
  { mes: "Feb", prestamos: 78, devoluciones: 72 },
  { mes: "Mar", prestamos: 90, devoluciones: 85 },
  { mes: "Abr", prestamos: 81, devoluciones: 79 },
  { mes: "May", prestamos: 95, devoluciones: 88 },
  { mes: "Jun", prestamos: 110, devoluciones: 105 },
];

const topBooks = [
  { nombre: "IA Moderna", prestamos: 45 },
  { nombre: "Python", prestamos: 38 },
  { nombre: "Marketing", prestamos: 32 },
  { nombre: "Cálculo", prestamos: 28 },
  { nombre: "BD", prestamos: 25 },
];

const categoryData = [
  { name: "Tecnología", value: 45 },
  { name: "Negocios", value: 25 },
  { name: "Matemáticas", value: 15 },
  { name: "Otros", value: 15 },
];

const COLORS = ["#1E3A8A", "#16A34A", "#D97706", "#8B5CF6"];

const activeUsers = [
  { mes: "Ene", usuarios: 520 },
  { mes: "Feb", usuarios: 580 },
  { mes: "Mar", usuarios: 650 },
  { mes: "Abr", usuarios: 720 },
  { mes: "May", usuarios: 800 },
  { mes: "Jun", usuarios: 890 },
];

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Dashboard Administrativo</h2>
          <p className="text-muted-foreground">Resumen general del sistema de biblioteca</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
              <p className="text-xs text-accent mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {stat.change} vs mes anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Préstamos y Devoluciones</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loansByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="prestamos" fill="#1E3A8A" name="Préstamos" />
                <Bar dataKey="devoluciones" fill="#16A34A" name="Devoluciones" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Libros Más Prestados</CardTitle>
            <CardDescription>Top 5 del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topBooks} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nombre" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="prestamos" fill="#1E3A8A" name="Préstamos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categoría</CardTitle>
            <CardDescription>Materiales en el catálogo</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios Activos</CardTitle>
            <CardDescription>Tendencia de crecimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activeUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="usuarios" stroke="#16A34A" strokeWidth={2} name="Usuarios" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
          <CardDescription>Últimas acciones del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { user: "Juan Pérez", action: "Préstamo realizado", book: "Inteligencia Artificial Moderna", time: "Hace 5 minutos" },
              { user: "María García", action: "Devolución registrada", book: "Marketing Digital", time: "Hace 15 minutos" },
              { user: "Carlos López", action: "Reserva creada", book: "Cálculo Diferencial", time: "Hace 30 minutos" },
              { user: "Ana Martínez", action: "Descarga digital", book: "Programación en Python", time: "Hace 1 hora" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}: {activity.book}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
