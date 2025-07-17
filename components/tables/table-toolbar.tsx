"use client";

import { useState } from "react";
import { IconSearch, IconFilter, IconDownload, IconTrash, IconCalendar, IconLayoutColumns, IconChevronDown } from "@tabler/icons-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { ExportDialog } from "@/components/dialogs/export-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableExport?: boolean;
  enableBulkDelete?: boolean;
  enableColumnVisibility?: boolean;
  searchPlaceholder?: string;
  selectedRows: TData[];
  onExport?: (selectedRows: TData[]) => void;
  onBulkDelete?: (selectedRows: TData[]) => void;
}

export function TableToolbar<TData>({
  table,
  enableSearch = false,
  enableFilters = false,
  enableExport = false,
  enableBulkDelete = false,
  enableColumnVisibility = true,
  searchPlaceholder = "Buscar...",
  selectedRows,
  onExport,
  onBulkDelete,
}: TableToolbarProps<TData>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;

  const handleExport = (format: 'pdf' | 'excel' | 'json', startDate: Date, endDate: Date, status?: boolean) => {
    if (onExport) {
      onExport(selectedRows);
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete) return;
    
    setIsDeleting(true);
    try {
      await onBulkDelete(selectedRows);
      table.toggleAllPageRowsSelected(false);
    } catch (error) {
      console.error('Error deleting items:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDateFilter = (from: Date | undefined, to: Date | undefined) => {
    setDateRange({ from, to });
    // Aquí implementarías la lógica de filtrado por fechas
    console.log("Filtering by date range:", { from, to });
  };

  return (
    <>
      <div className="flex flex-col gap-4 px-4 lg:px-6 mb-4">
        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            {enableSearch && (
              <div className="relative flex-1 max-w-sm">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={table.getState().globalFilter ?? ""}
                  onChange={(event) => table.setGlobalFilter(event.target.value)}
                  className="pl-8"
                />
              </div>
            )}
            {enableFilters && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconCalendar className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange?.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Filtrar por fecha"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range || { from: undefined, to: undefined });
                      if (range?.from && range?.to) {
                        handleDateFilter(range.from, range.to);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Acciones siempre visibles */}
          <div className="flex items-center gap-2">
            {enableBulkDelete && hasSelection && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Eliminar {selectedCount > 0 ? `(${selectedCount})` : ''}
              </Button>
            )}
            {enableExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportDialog(true)}
              >
                <IconDownload className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            )}
            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconLayoutColumns />
                    <span className="hidden lg:inline">Visualizar</span>
                    <span className="lg:hidden">Columnas</span>
                    <IconChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {table
                    .getAllColumns()
                    .filter(
                      column =>
                        typeof column.accessorFn !== "undefined" &&
                        column.getCanHide()
                    )
                    .map(column => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={value =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación de eliminación */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        description={`¿Estás seguro de que quieres eliminar ${selectedCount} elemento${selectedCount !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleBulkDelete}
        isPending={isDeleting}
      />

      {/* Diálogo de exportación */}
      <ExportDialog
        open={showExportDialog}
        setOpen={setShowExportDialog}
        onExport={handleExport}
        title="Exportar datos"
        description="Selecciona el formato y rango de fechas para exportar los datos."
        buttonText="Exportar"
      />
    </>
  );
} 