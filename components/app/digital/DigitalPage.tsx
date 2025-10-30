"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  Download,
  Eye,
  FileText,
  Search,
} from "lucide-react";
import { useState } from "react";

const digitalBooks = [
  {
    id: 1,
    title: "Inteligencia Artificial: Un Enfoque Moderno",
    author: "Stuart Russell, Peter Norvig",
    category: "Tecnología",
    year: 2021,
    format: "PDF",
    size: "12.5 MB",
    pages: 1152,
    downloads: 245,
    views: 890,
    type: "libro",
  },
  {
    id: 2,
    title: "Programación Avanzada en Python",
    author: "Mark Lutz",
    category: "Tecnología",
    year: 2023,
    format: "PDF",
    size: "8.2 MB",
    pages: 624,
    downloads: 189,
    views: 567,
    type: "libro",
  },
  {
    id: 3,
    title: "Machine Learning y Big Data",
    author: "Juan Pérez López",
    category: "Tecnología",
    year: 2024,
    format: "PDF",
    size: "5.8 MB",
    pages: 198,
    downloads: 45,
    views: 123,
    type: "tesis",
  },
  {
    id: 4,
    title: "Marketing Digital en Redes Sociales",
    author: "María García",
    category: "Negocios",
    year: 2024,
    format: "PDF",
    size: "3.2 MB",
    pages: 156,
    downloads: 67,
    views: 234,
    type: "tesis",
  },
];

const myDownloads = [
  {
    id: 2,
    title: "Programación Avanzada en Python",
    author: "Mark Lutz",
    downloadDate: "2025-10-15",
    lastRead: "2025-10-20",
  },
  {
    id: 1,
    title: "Inteligencia Artificial: Un Enfoque Moderno",
    author: "Stuart Russell",
    downloadDate: "2025-09-28",
    lastRead: "2025-10-18",
  },
];

export function DigitalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<
    (typeof digitalBooks)[0] | null
  >(null);
  const [showDialog, setShowDialog] = useState(false);
  const [viewerMode, setViewerMode] = useState(false);

  const filteredMaterials = digitalBooks.filter(
    (material) =>
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (material: (typeof digitalBooks)[0]) => {
    setSelectedMaterial(material);
    setShowDialog(true);
  };

  const handleReadOnline = () => {
    setShowDialog(false);
    setViewerMode(true);
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
                  {digitalBooks.filter((b) => b.type === "libro").length}
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
                  {digitalBooks.filter((b) => b.type === "tesis").length}
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
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Mostrando {filteredMaterials.length} material(es)
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMaterials.map((material) => (
                <Card
                  key={material.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewDetails(material)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base line-clamp-2">
                          {material.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {material.author}
                        </p>
                      </div>
                      <FileText className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">{material.category}</Badge>
                        <Badge
                          variant="outline"
                          className="bg-accent/10 text-accent-foreground"
                        >
                          {material.type === "libro" ? "Libro" : "Tesis"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Formato: {material.format}</p>
                        <p>Tamaño: {material.size}</p>
                        <p>Páginas: {material.pages}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {material.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {material.views}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      Leer
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Download className="mr-1 h-3 w-3" />
                      Descargar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredMaterials.length === 0 && (
              <Card className="p-12">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3>No se encontraron materiales</h3>
                  <p className="text-muted-foreground">
                    Intenta con otros términos de búsqueda
                  </p>
                </div>
              </Card>
            )}
          </div>
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
                        Última lectura:{" "}
                        {new Date(download.lastRead).toLocaleDateString(
                          "es-ES"
                        )}
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

      {/* Dialog de detalles */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.title}</DialogTitle>
            <DialogDescription>{selectedMaterial?.author}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Categoría</Label>
                <p>{selectedMaterial?.category}</p>
              </div>
              <div>
                <Label>Tipo</Label>
                <p className="capitalize">{selectedMaterial?.type}</p>
              </div>
              <div>
                <Label>Año de Publicación</Label>
                <p>{selectedMaterial?.year}</p>
              </div>
              <div>
                <Label>Formato</Label>
                <p>{selectedMaterial?.format}</p>
              </div>
              <div>
                <Label>Tamaño del Archivo</Label>
                <p>{selectedMaterial?.size}</p>
              </div>
              <div>
                <Label>Número de Páginas</Label>
                <p>{selectedMaterial?.pages}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {selectedMaterial?.downloads} descargas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {selectedMaterial?.views} vistas
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReadOnline}
            >
              <Eye className="mr-2 h-4 w-4" />
              Leer en Línea
            </Button>
            <Button className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visor de PDF simulado */}
      {viewerMode && (
        <Dialog open={viewerMode} onOpenChange={setViewerMode}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>{selectedMaterial?.title}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  Visor de PDF - Aquí se mostraría el contenido del documento
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedMaterial?.title} ({selectedMaterial?.pages} páginas)
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
