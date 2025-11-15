"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import type { Loan } from "@/actions/loans";

type Props = { loans?: Loan[]; materials?: { id: string; title: string; author: string }[] };

export function LoansPage({ loans, materials }: Props) {
  const matMap = new Map((materials ?? []).map((m) => [m.id, m]));
  const activeLoans = (loans ?? []).filter((l) => l.status === "active").map((l) => ({
    id: l.id,
    book: matMap.get(l.material_id)?.title ?? "Material",
    author: matMap.get(l.material_id)?.author ?? "",
    loanDate: l.loan_date,
    dueDate: l.due_date,
    status: "activo" as const,
    renewals: l.renewals,
  }));

  const loanHistory = (loans ?? []).filter((l) => l.status !== "active").map((l) => ({
    id: l.id,
    book: matMap.get(l.material_id)?.title ?? "Material",
    author: matMap.get(l.material_id)?.author ?? "",
    loanDate: l.loan_date,
    returnDate: l.return_date ?? l.due_date,
    status: l.status === "returned" ? "devuelto" : "vencido",
    onTime: !!(l.return_date && new Date(l.return_date) <= new Date(l.due_date)),
  }));

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Vencido
        </Badge>
      );
    } else if (daysRemaining <= 3) {
      return (
        <Badge className="bg-orange-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Por vencer
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-accent flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Activo
        </Badge>
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Mis Préstamos</h2>
        <p className="text-muted-foreground">Administra tus préstamos activos e historial</p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            <BookOpen className="mr-2 h-4 w-4" />
            Activos ({activeLoans.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="mr-2 h-4 w-4" />
            Historial ({loanHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeLoans.map((loan) => {
            const daysRemaining = getDaysRemaining(loan.dueDate);
            const totalDays = 15; // Días de préstamo
            const daysElapsed = totalDays - daysRemaining;
            const progress = (daysElapsed / totalDays) * 100;

            return (
              <Card key={loan.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{loan.book}</CardTitle>
                      <CardDescription>{loan.author}</CardDescription>
                    </div>
                    {getStatusBadge(daysRemaining)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Préstamo</p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {new Date(loan.loanDate).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Vencimiento</p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {new Date(loan.dueDate).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Días Restantes</p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {daysRemaining > 0 ? daysRemaining : 0} días
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progreso del préstamo</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      Renovar Préstamo
                      {loan.renewals > 0 && (
                        <Badge variant="secondary" className="ml-2">{loan.renewals}x</Badge>
                      )}
                    </Button>
                    <Button className="flex-1">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Marcar como Devuelto
                    </Button>
                  </div>

                  {daysRemaining < 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Este préstamo está vencido. Por favor, devuelve el libro lo antes posible para evitar penalizaciones.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {activeLoans.length === 0 && (
            <Card className="p-12">
              <div className="text-center space-y-2">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3>No tienes préstamos activos</h3>
                <p className="text-muted-foreground">Explora el catálogo para solicitar un préstamo</p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Préstamos</CardTitle>
              <CardDescription>Registro completo de tus préstamos anteriores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Libro</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Fecha Préstamo</TableHead>
                    <TableHead>Fecha Devolución</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanHistory.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>{loan.book}</TableCell>
                      <TableCell className="text-muted-foreground">{loan.author}</TableCell>
                      <TableCell>{new Date(loan.loanDate).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell>{new Date(loan.returnDate).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell>
                        <Badge variant={loan.onTime ? "default" : "secondary"} className={loan.onTime ? "bg-accent" : ""}>
                          {loan.onTime ? (<><CheckCircle2 className="h-3 w-3 mr-1" />A tiempo</>) : (<><AlertCircle className="h-3 w-3 mr-1" />Tardío</>)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Comprobante
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
