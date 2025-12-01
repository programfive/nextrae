"use client";
import type { DigitalMaterial, UserDownload } from "@/actions/digital";
import { CatalogBookDialog } from "@/components/app/catalog/CatalogBookDialog";
import { CatalogGrid } from "@/components/app/catalog/CatalogGrid";
import type { UIBook } from "@/components/app/catalog/CatalogPage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  Download,
  Eye,
  FileText,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  materials: DigitalMaterial[];
  downloads: UserDownload[];
};

export function DigitalPage({ materials, downloads }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState<UIBook | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const mapType = (t: DigitalMaterial["type"]): UIBook["type"] =>
    t === "digital" ? "Digital" : "Tesis";

  const mapStatus = (s: DigitalMaterial["status"]): UIBook["status"] =>
    s === "available"
      ? "Disponible"
      : s === "loaned"
      ? "Prestado"
      : "Reservado";

  const books: UIBook[] = useMemo(
    () =>
      materials.map((m) => ({
        id: m.id,
        title: m.title,
        author: m.author,
        category: m.category ?? "General",
        year: m.year ?? 0,
        type: mapType(m.type),
        status: mapStatus(m.status),
        isbn: m.isbn ?? "",
        description: m.description ?? "",
        fileUrl: m.file_url,
        copiesTotal: null,
        copiesAvailable: null,
      })),
    [materials]
  );

  const filteredBooks = books.filter((book) => {
    const term = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term) ||
      book.isbn.toLowerCase().includes(term)
    );
  });

  const myDownloads = useMemo(
    () =>
      downloads.map((d) => ({
        id: d.id,
        materialId: d.material_id,
        title: d.material?.title ?? "Material",
        author: d.material?.author ?? "",
        downloadDate: d.downloaded_at,
      })),
    [downloads]
  );

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Materiales Digitales</h2>
        <p className="text-muted-foreground">
          Accede a nuestra biblioteca digital de libros y tesis
        </p>
      </div>

      <Tabs defaultValue="catalog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalog">
            <BookOpen className="mr-2 h-4 w-4" />
            Catálogo Digital
          </TabsTrigger>
          <TabsTrigger value="downloads">
            <Download className="mr-2 h-4 w-4" />
            Mis Descargas ({myDownloads.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          {/* Buscador */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Material Digital
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, autor o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">
                  Total Libros Digitales
                </CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {books.filter((b) => b.type === "Digital").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Tesis Disponibles</CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {books.filter((b) => b.type === "Tesis").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Mis Descargas</CardTitle>
                <Download className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{myDownloads.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          <CatalogGrid
            books={filteredBooks}
            getStatusVariant={getStatusVariant}
            onBookClick={(book) => {
              setSelectedBook(book);
              setShowDialog(true);
            }}
            canEdit={false}
          />
        </TabsContent>

        <TabsContent value="downloads">
          <Card>
            <CardHeader>
              <CardTitle>Mis Descargas</CardTitle>
              <CardDescription>
                Materiales que has descargado previamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myDownloads.map((download) => (
                <div
                  key={download.id}
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{download.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {download.author}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        Descargado:{" "}
                        {new Date(download.downloadDate).toLocaleDateString(
                          "es-ES"
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3 w-3" />
                      Leer
                    </Button>
                  </div>
                </div>
              ))}

              {myDownloads.length === 0 && (
                <div className="text-center py-12">
                  <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3>No tienes descargas</h3>
                  <p className="text-muted-foreground mb-4">
                    Explora el catálogo digital para descargar materiales
                  </p>
                  <Button onClick={() => setSearchTerm("")}>
                    Explorar Catálogo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CatalogBookDialog
        book={selectedBook}
        open={showDialog}
        onOpenChange={setShowDialog}
        getStatusVariant={getStatusVariant}
        reserving={false}
        reserveMsg={null}
        onReserve={() => {}}
        onLoan={() => {}}
      />
    </div>
  );
}
