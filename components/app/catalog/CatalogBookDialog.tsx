"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BookOpen, Calendar, Eye } from "lucide-react";
import type { UIBook } from "./CatalogPage";

type CatalogBookDialogProps = {
  book: UIBook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusVariant: (status: string) => "default" | "secondary" | "outline";
  reserving: boolean;
  reserveMsg: string | null;
  onReserve: (materialId: string) => void;
  onLoan: (materialId: string) => void;
};

export function CatalogBookDialog({
  book,
  open,
  onOpenChange,
  getStatusVariant,
  reserving,
  reserveMsg,
  onReserve,
  onLoan,
}: CatalogBookDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{book?.title}</DialogTitle>
          <DialogDescription>{book?.author}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Categoría</Label>
              <p>{book?.category}</p>
            </div>
            <div>
              <Label>Año de Publicación</Label>
              <p>{book?.year}</p>
            </div>
            <div>
              <Label>Tipo</Label>
              <p>{book?.type}</p>
            </div>
            <div>
              <Label>ISBN</Label>
              <p>{book?.isbn}</p>
            </div>
          </div>

          {book?.type === "Físico" && (
            <div>
              <Label>Unidades</Label>
              <p>
                {book.copiesAvailable ?? "-"}
                {book.copiesTotal != null ? ` de ${book.copiesTotal}` : ""}
              </p>
            </div>
          )}

          <div>
            <Label>Descripción</Label>
            <p className="text-muted-foreground">{book?.description}</p>
          </div>

          <div>
            <Label>Estado</Label>
            <Badge variant={getStatusVariant(book?.status || "")}>
              {book?.status}
            </Badge>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {book?.type === "Digital" ? (
            <>
              {book?.fileUrl ? (
                <Button className="w-full md:w-fit" asChild>
                  <a
                    href={book.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Leer ahora
                  </a>
                </Button>
              ) : (
                <Button className="w-full md:w-fit" variant="outline" disabled>
                  Archivo no disponible
                </Button>
              )}
            </>
          ) : (
            <>
              {book?.status === "Disponible" && (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={reserving}
                    onClick={() => book && onReserve(book.id)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {reserving ? "Reservando..." : "Reservar"}
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={reserving}
                    onClick={() => book && onLoan(book.id)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {reserving ? "Solicitando..." : "Solicitar Préstamo"}
                  </Button>
                </>
              )}
              {book?.status === "Prestado" && (
                <Button variant="outline" className="w-full" disabled>
                  No Disponible
                </Button>
              )}
              {book?.status === "Reservado" && (
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Reserva
                </Button>
              )}
            </>
          )}
        </DialogFooter>
        {reserveMsg && (
          <p className="text-sm text-muted-foreground px-2 pb-2">
            {reserveMsg}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
