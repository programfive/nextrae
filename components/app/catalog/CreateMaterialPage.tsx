"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { uploadFileToDrive } from "@/lib/upload-files";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CategoryLite = { id: string; name: string; slug: string | null };

const materialFormSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  author: z.string().min(1, "El autor es obligatorio"),
  categoryIds: z.array(z.string()).optional(),
  year: z
    .string()
    .optional()
    .refine((val) => !val || (!Number.isNaN(Number(val)) && Number(val) > 0), {
      message: "Año inválido",
    }),
  type: z.enum(["physical", "digital"], {
    message: "El tipo es obligatorio",
  }),
  status: z.enum(["available", "loaned", "reserved"], {
    message: "El estado es obligatorio",
  }),
  isbn: z.string().optional(),
  filePath: z.string().optional(),
  file: z.any().optional(),
  description: z.string().optional(),
});

export type MaterialFormInput = z.input<typeof materialFormSchema>;

type UploadDriveResult = {
  fileUrl?: string;
  url?: string;
  webViewLink?: string;
  webContentLink?: string;
  id?: string;
  [key: string]: unknown;
};

type Props = {
  categories: CategoryLite[];
  createMaterialAction?: (values: Omit<MaterialFormInput, "file">) => Promise<void>;
};

export function CreateMaterialPage({ categories, createMaterialAction }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<MaterialFormInput>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      title: "",
      author: "",
      categoryIds: [],
      year: "",
      type: "physical",
      status: "available",
      isbn: "",
      file: [],
      description: "",
    },
  });

  const watchType = form.watch("type");

  const handleSubmit = async (values: MaterialFormInput) => {
    const { file, ...rest } = values;

    const firstFile: File | undefined = Array.isArray(file) ? file[0] : undefined;

    let filePath: string | undefined;

    if (firstFile) {
      try {
        setIsUploading(true);
        const result = await uploadFileToDrive(firstFile as File);

        if (typeof result === "string") {
          filePath = result;
        } else if (result && typeof result === "object") {
          const uploadResult = result as UploadDriveResult;
          filePath =
            uploadResult.fileUrl ||
            uploadResult.url ||
            uploadResult.webViewLink ||
            uploadResult.webContentLink ||
            uploadResult.id ||
            undefined;
        }

        if (filePath) {
          form.setValue("filePath", filePath);
        }
      } catch (err) {
        console.error("Error al subir archivo a Google Drive", err);
      } finally {
        setIsUploading(false);
      }
    }

    if (typeof createMaterialAction === "function") {
      startTransition(() => {
        createMaterialAction({
          ...rest,
          filePath,
        }).then(() => {
          router.push("/catalog");
        });
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Nuevo material</h2>
          <p className="text-muted-foreground">
            Completa la información para registrar un nuevo material en el catálogo.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/catalog")}>
          Volver al catálogo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del material</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
              aria-busy={isPending}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="material-title">Título</Label>
                      <FormControl>
                        <Input id="material-title" placeholder="Título del material" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="material-author">Autor</Label>
                      <FormControl>
                        <Input id="material-author" placeholder="Nombre del autor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="material-year">Año de publicación</Label>
                      <FormControl>
                        <Input
                          id="material-year"
                          type="number"
                          placeholder="Ej. 2020"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="material-isbn">ISBN</Label>
                      <FormControl>
                        <Input id="material-isbn" placeholder="Opcional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor="material-category">Categorías</Label>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { label: "Sin categoría", value: "none" },
                          ...categories.map((c) => ({ label: c.name, value: c.id })),
                        ]}
                        value={field.value?.length ? field.value : []}
                        onChange={(vals) => {
                          const filtered = vals.filter((v) => v !== "none");
                          field.onChange(filtered);
                        }}
                        placeholder="Selecciona una o varias categorías"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="material-status">Estado</Label>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="material-status" className="w-auto min-w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Disponible</SelectItem>
                            <SelectItem value="loaned">Prestado</SelectItem>
                            <SelectItem value="reserved">Reservado</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="material-type">Tipo</Label>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="material-type" className="w-auto min-w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="physical">Físico</SelectItem>
                            <SelectItem value="digital">Digital</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {watchType === "digital" && (
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="material-file">Archivo digital</Label>
                      <FormControl>
                        <FileUpload
                          value={field.value ?? []}
                          onValueChange={field.onChange}
                          maxFiles={1}
                          maxSize={10 * 1024 * 1024} // 10 MB
                        >
                          <FileUploadDropzone>
                            <div className="flex flex-col items-center justify-center gap-3 py-6 text-sm text-muted-foreground">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                <Upload className="h-5 w-5" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium">Drag &amp; drop files here</p>
                                <p className="text-xs text-muted-foreground">
                                  Or click to browse (max 2 files, up to 5MB each)
                                </p>
                              </div>
                              <FileUploadTrigger asChild>
                                <Button type="button" variant="outline" size="sm">
                                  Browse files
                                </Button>
                              </FileUploadTrigger>
                            </div>
                          </FileUploadDropzone>

                          <FileUploadList>
                            {Array.isArray(field.value) &&
                              field.value.map((file) => (
                                <FileUploadItem
                                  key={`${file.name}-${file.size}`}
                                  value={file}
                                >
                                  <FileUploadItemPreview className="bg-transparent">
                                      <FileText className="h-6 w-6 text-foreground" />
                                  </FileUploadItemPreview>
                                  <FileUploadItemMetadata />
                                  <FileUploadItemDelete>
                                    <Button type="button" variant="ghost" size="icon">
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </FileUploadItemDelete>
                                </FileUploadItem>
                              ))}
                          </FileUploadList>
                        </FileUpload>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor="material-description">Descripción</Label>
                    <FormControl>
                      <Textarea
                        id="material-description"
                        rows={4}
                        placeholder="Descripción breve del material"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/catalog")}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending || isUploading}>
                  {isUploading
                    ? "Subiendo archivo..."
                    : isPending
                      ? "Guardando..."
                      : "Guardar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
