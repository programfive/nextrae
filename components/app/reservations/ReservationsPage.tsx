import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import type { Reservation } from "@/actions/reservations";

type Props = { reservations?: Reservation[]; materials?: { id: string; title: string; author: string }[] };

export function ReservationsPage({ reservations, materials }: Props) {
  const matMap = new Map((materials ?? []).map((m) => [m.id, m]));
  const activeReservations = (reservations ?? [])
    .filter((r) => r.status === "pending")
    .map((r) => ({
      id: r.id,
      book: matMap.get(r.material_id)?.title ?? "Material",
      author: matMap.get(r.material_id)?.author ?? "",
      reservationDate: r.reservation_date,
      expiryDate: r.expiry_date,
      status: "pendiente" as const,
      pickupLocation: "Sala de Préstamos - Piso 1",
    }));

  const reservationHistory = (reservations ?? [])
    .filter((r) => r.status !== "pending")
    .map((r) => ({
      id: r.id,
      book: matMap.get(r.material_id)?.title ?? "Material",
      author: matMap.get(r.material_id)?.author ?? "",
      reservationDate: r.reservation_date,
      completedDate: r.completed_date ?? undefined,
      expiryDate: r.expiry_date,
      status: r.status === "completed" ? "completada" : r.status === "expired" ? "expirada" : "cancelada",
    }));
  const getDaysRemaining = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status: string, expiryDate?: string) => {
    if (status === "pendiente" && expiryDate) {
      const daysRemaining = getDaysRemaining(expiryDate);
      if (daysRemaining <= 0) {
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Expirada
          </Badge>
        );
      } else if (daysRemaining <= 2) {
        return (
          <Badge className="bg-orange-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Por expirar
          </Badge>
        );
      }
    }

    switch (status) {
      case "pendiente":
        return (
          <Badge className="bg-accent flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        );
      case "completada":
        return (
          <Badge className="bg-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completada
          </Badge>
        );
      case "expirada":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Expirada
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Mis Reservas</h2>
        <p className="text-muted-foreground">
          Administra tus reservas activas e historial
        </p>
      </div>

      {/* Reservas activas */}
      <div className="space-y-4">
        <h3>Reservas Activas</h3>

        {activeReservations.map((reservation) => {
          const daysRemaining = getDaysRemaining(reservation.expiryDate);
          const totalDays = 5; // Días para recoger
          const daysElapsed = totalDays - daysRemaining;
          const progress = (daysElapsed / totalDays) * 100;

          return (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {reservation.book}
                    </CardTitle>
                    <CardDescription>{reservation.author}</CardDescription>
                  </div>
                  {getStatusBadge(reservation.status, reservation.expiryDate)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fecha de Reserva
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(reservation.reservationDate).toLocaleDateString(
                        "es-ES"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Válido Hasta
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(reservation.expiryDate).toLocaleDateString(
                        "es-ES"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tiempo Restante
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {daysRemaining > 0 ? `${daysRemaining} días` : "Expirado"}
                    </p>
                  </div>
                </div>

                {daysRemaining > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Tiempo de reserva
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <Alert >
                  <BookOpen className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    <strong>Lugar de Retiro:</strong>{" "}
                    {reservation.pickupLocation}
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Marcar como Recogido
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar Reserva
                  </Button>
                </div>

                {daysRemaining <= 2 && daysRemaining > 0 && (
                  <Alert className="bg-orange-50 border-orange-200">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      Tu reserva expirará pronto. Por favor, recoge el libro
                      antes del{" "}
                      {new Date(reservation.expiryDate).toLocaleDateString(
                        "es-ES"
                      )}
                      .
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}

        {activeReservations.length === 0 && (
          <Card className="p-12">
            <div className="text-center space-y-2">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3>No tienes reservas activas</h3>
              <p className="text-muted-foreground">
                Explora el catálogo para reservar un libro
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Historial de reservas */}
      <div className="space-y-4">
        <h3>Historial de Reservas</h3>

        <Card>
          <CardHeader>
            <CardTitle>Reservas Anteriores</CardTitle>
            <CardDescription>
              Registro completo de tus reservas pasadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reservationHistory.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{reservation.book}</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.author}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Reservado:{" "}
                        {new Date(
                          reservation.reservationDate
                        ).toLocaleDateString("es-ES")}
                      </span>
                      {reservation.completedDate && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Completado:{" "}
                          {new Date(
                            reservation.completedDate
                          ).toLocaleDateString("es-ES")}
                        </span>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(reservation.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
