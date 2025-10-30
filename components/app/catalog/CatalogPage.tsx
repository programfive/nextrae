"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Download, Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const mockBooks = [
  { id: 1, title: "Inteligencia Artificial Moderna", author: "Stuart Russell, Peter Norvig", category: "Tecnología", year: 2021, type: "Físico", status: "Disponible", isbn: "978-0136042594", description: "El libro de IA más completo y actualizado. Cubre aprendizaje automático, procesamiento de lenguaje natural y más." },
  { id: 2, title: "Diseño de Bases de Datos", author: "Carlos Coronel, Steven Morris", category: "Tecnología", year: 2020, type: "Físico", status: "Prestado", isbn: "978-1337627900", description: "Guía completa sobre diseño, implementación y gestión de bases de datos relacionales." },
  { id: 3, title: "Marketing Digital", author: "Philip Kotler", category: "Negocios", year: 2022, type: "Digital", status: "Disponible", isbn: "978-0134601564", description: "Estrategias de marketing en la era digital, incluyendo redes sociales y SEO." },
  { id: 4, title: "Cálculo Diferencial e Integral", author: "James Stewart", category: "Matemáticas", year: 2019, type: "Físico", status: "Disponible", isbn: "978-1285740621", description: "Texto fundamental para el estudio del cálculo universitario." },
  { id: 5, title: "Programación en Python", author: "Mark Lutz", category: "Tecnología", year: 2023, type: "Digital", status: "Disponible", isbn: "978-1449355739", description: "Guía definitiva para aprender Python desde principiante hasta avanzado." },
  { id: 6, title: "Contabilidad Financiera", author: "Warren Reeve", category: "Negocios", year: 2021, type: "Físico", status: "Reservado", isbn: "978-1337272094", description: "Fundamentos de contabilidad financiera con casos prácticos." },
];

export function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<typeof mockBooks[0] | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    const matchesType = typeFilter === "all" || book.type === typeFilter;
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleBookClick = (book: typeof mockBooks[0]) => {
    setSelectedBook(book);
    setShowDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponible":
        return "bg-accent text-accent-foreground";
      case "Prestado":
        return "bg-secondary";
      case "Reservado":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Catálogo de Biblioteca</h2>
        <p className="text-muted-foreground">Explora nuestra colección de {mockBooks.length} materiales</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda Avanzada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por título, autor o ISBN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Categoría</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="Tecnología">Tecnología</SelectItem>
                  <SelectItem value="Negocios">Negocios</SelectItem>
                  <SelectItem value="Matemáticas">Matemáticas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="Físico">Físico</SelectItem>
                  <SelectItem value="Digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Prestado">Prestado</SelectItem>
                  <SelectItem value="Reservado">Reservado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <p className="text-sm text-muted-foreground mb-4">Mostrando {filteredBooks.length} resultado(s)</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleBookClick(book)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base line-clamp-2">{book.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                  </div>
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{book.category}</Badge>
                    <Badge variant="outline">{book.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Año: {book.year}</span>
                    <Badge className={getStatusColor(book.status)}>{book.status}</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">Ver Detalles</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <Card className="p-12">
            <div className="text-center space-y-2">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3>No se encontraron resultados</h3>
              <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </Card>
        )}
      </div>

      {filteredBooks.length > 0 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm" disabled>
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
            <DialogDescription>{selectedBook?.author}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Categoría</Label>
                <p>{selectedBook?.category}</p>
              </div>
              <div>
                <Label>Año de Publicación</Label>
                <p>{selectedBook?.year}</p>
              </div>
              <div>
                <Label>Tipo</Label>
                <p>{selectedBook?.type}</p>
              </div>
              <div>
                <Label>ISBN</Label>
                <p>{selectedBook?.isbn}</p>
              </div>
            </div>

            <div>
              <Label>Descripción</Label>
              <p className="text-muted-foreground">{selectedBook?.description}</p>
            </div>

            <div>
              <Label>Estado</Label>
              <Badge className={getStatusColor(selectedBook?.status || "")}>{selectedBook?.status}</Badge>
            </div>
          </div>

          <DialogFooter className="gap-2">
            {selectedBook?.type === "Digital" ? (
              <>
                <Button variant="outline" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  Leer en Línea
                </Button>
                <Button className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </Button>
              </>
            ) : (
              <>
                {selectedBook?.status === "Disponible" && (
                  <>
                    <Button variant="outline" className="flex-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      Reservar
                    </Button>
                    <Button className="flex-1">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Solicitar Préstamo
                    </Button>
                  </>
                )}
                {selectedBook?.status === "Prestado" && (
                  <Button variant="outline" className="w-full" disabled>
                    No Disponible
                  </Button>
                )}
                {selectedBook?.status === "Reservado" && (
                  <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver Reserva
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
