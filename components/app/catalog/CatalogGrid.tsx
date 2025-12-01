"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { UIBook } from "./CatalogPage";

type CatalogGridProps = {
  books: UIBook[];
  getStatusVariant: (status: string) => "default" | "secondary" | "outline";
  onBookClick: (book: UIBook) => void;
  canEdit?: boolean;
};

export function CatalogGrid({
  books,
  getStatusVariant,
  onBookClick,
  canEdit = false,
}: CatalogGridProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Mostrando {books.length} resultado(s)
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => {
          console.log(book);
          return (
            <Card
              key={book.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onBookClick(book)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base line-clamp-2">
                      {book.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {book.author}
                    </p>
                  </div>
                  <BookOpen className="h-5 w-5 flex-shrink-0 ml-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{book.category}</Badge>
                    <Badge variant="outline">{book.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Año: {book.year}
                    </span>
                    <Badge variant={getStatusVariant(book.status)}>
                      {book.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookClick(book);
                  }}
                >
                  Ver Detalles
                </Button>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    href={`/catalog/${book.id}/edit`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Editar
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {books.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-2">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3>No se encontraron resultados</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
