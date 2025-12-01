"use client";

import type { Material } from "@/actions/catalog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CatalogBookDialog } from "./CatalogBookDialog";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogGrid } from "./CatalogGrid";
type CategoryLite = { id: string; name: string; slug: string | null };
type Props = {
  materials?: Material[];
  categories?: CategoryLite[];
  initialCategory?: string;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  canEdit?: boolean;
};

export type UIBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  type: "Físico" | "Digital" | "Tesis";
  status: "Disponible" | "Prestado" | "Reservado";
  isbn: string;
  description: string;
  fileUrl?: string | null;
  copiesTotal?: number | null;
  copiesAvailable?: number | null;
};

export function CatalogPage({
  materials,
  categories = [],
  initialCategory = "all",
  totalCount = 0,
  currentPage = 1,
  pageSize = 24,
  canEdit = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [books, setBooks] = useState<UIBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<UIBook | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [loaning, setLoaning] = useState(false);
  const [reserveMsg, setReserveMsg] = useState<string | null>(null);

  // Mantener el estado en sync si cambia la URL externamente
  useEffect(() => {
    const urlCategory = searchParams.get("category") ?? "all";
    if (urlCategory !== categoryFilter) setCategoryFilter(urlCategory);
  }, [searchParams, categoryFilter]);

  // Map server materials (enums) to UI labels in Spanish like the mock
  const mapType = (t: Material["type"]) =>
    t === "physical" ? "Físico" : t === "digital" ? "Digital" : "Tesis";
  const mapStatus = (s: Material["status"]) =>
    s === "available"
      ? "Disponible"
      : s === "loaned"
      ? "Prestado"
      : "Reservado";

  const sourceBooks: UIBook[] = useMemo(
    () =>
      (materials ?? []).map((m) => ({
        id: m.id,
        title: m.title,
        author: m.author,
        category: m.categories?.name ?? m.category ?? "General",
        year: m.year ?? 0,
        type: mapType(m.type) as UIBook["type"],
        status: mapStatus(m.status) as UIBook["status"],
        isbn: m.isbn ?? "",
        description: m.description ?? "",
        fileUrl: m.file_url ?? m.digital_assets?.[0]?.file_path ?? null,
        copiesTotal: m.copies_total ?? null,
        copiesAvailable: m.copies_available ?? null,
      })),
    [materials]
  );

  // Inicializar/actualizar libros en estado cuando cambian los materiales mapeados
  useEffect(() => {
    setBooks(sourceBooks);
  }, [sourceBooks]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || book.category === categoryFilter;
    const matchesType = typeFilter === "all" || book.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || book.status === statusFilter;

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleBookClick = (book: UIBook) => {
    setSelectedBook(book);
    setShowDialog(true);
  };

  const handleLoan = async (materialId: string) => {
    try {
      setLoaning(true);
      const res = await fetch("/api/loans/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        const errorMsg = json.error || "No se pudo crear el préstamo";
        toast.error(errorMsg);
        if (
          errorMsg.includes("Ya tienes un préstamo activo para este material")
        ) {
          setShowDialog(false);
        }
        return;
      }
      // Marcar el libro como prestado en el estado local para deshabilitar nuevo préstamo
      setBooks((prev) =>
        prev.map((b) =>
          b.id === materialId ? { ...b, status: "Prestado" } : b
        )
      );
      setShowDialog(false);
      toast.success("Préstamo solicitado correctamente");
    } catch {
      toast.error("Error inesperado al solicitar el préstamo");
    } finally {
      setLoaning(false);
    }
  };

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    const params = new URLSearchParams(searchParams.toString());
    if (!val || val === "all") params.delete("category");
    else params.set("category", val);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReserve = async (materialId: string) => {
    try {
      setReserveMsg(null);
      setReserving(true);
      const res = await fetch("/api/reservations/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setReserveMsg(json.error || "No se pudo crear la reserva");
        toast.error(json.error || "No se pudo crear la reserva");
        return;
      }
      setReserveMsg("Reserva creada correctamente");
      setShowDialog(false);
      toast.success("Reserva creada correctamente");
    } catch {
      setReserveMsg("Error inesperado al reservar");
      toast.error("Error inesperado al reservar");
    } finally {
      setReserving(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Disponible":
        return "default" as const;
      case "Prestado":
        return "secondary" as const;
      case "Reservado":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / pageSize));

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage === 1) params.delete("page");
    else params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Catálogo de Biblioteca</h2>
          <p className="text-muted-foreground">
            Explora nuestra colección de {sourceBooks.length} materiales
          </p>
        </div>
        <Button href="/catalog/new">
          <Plus className="mr-2 h-4 w-4" />
          Agregar material
        </Button>
      </div>

      <CatalogFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={categories}
      />

      <CatalogGrid
        books={filteredBooks}
        getStatusVariant={getStatusVariant}
        onBookClick={handleBookClick}
        canEdit={canEdit}
      />

      {filteredBooks.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="pointer-events-none cursor-default"
            >
              Página {currentPage} de {totalPages}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <CatalogBookDialog
        book={selectedBook}
        open={showDialog}
        onOpenChange={setShowDialog}
        getStatusVariant={getStatusVariant}
        reserving={reserving || loaning}
        reserveMsg={reserveMsg}
        onReserve={handleReserve}
        onLoan={handleLoan}
      />
    </div>
  );
}
