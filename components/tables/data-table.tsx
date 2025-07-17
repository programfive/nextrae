"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DragHandle } from "./drag-handle";
import { DraggableRow } from "./draggable-row";
import { TableHeader as TableHeaderComponent } from "./table-header";
import { TablePagination } from "./table-pagination";
import { TableToolbar } from "./table-toolbar";

// Props del DataTable
export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableDrag?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableExport?: boolean;
  enableBulkDelete?: boolean;
  pageSize?: number;
  addButtonText?: string;
  onAddClick?: () => void;
  onExport?: (selectedRows: TData[]) => void;
  onBulkDelete?: (selectedRows: TData[]) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<TData>({
  data: initialData,
  columns,
  enableDrag = false,
  enableSelection = false,
  enablePagination = true,
  enableColumnVisibility = true,
  enableSorting = true,
  enableSearch = false,
  enableFilters = false,
  enableExport = false,
  enableBulkDelete = false,
  pageSize = 10,
  addButtonText = "Add Item",
  onAddClick,
  onExport,
  onBulkDelete,
  searchPlaceholder = "Search...",
  emptyMessage = "No results.",
  className,
}: DataTableProps<TData>) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((item: any) => item.id) || [],
    [data]
  );

  const finalColumns = React.useMemo(() => {
    if (enableDrag) {
      return [
        {
          id: "drag",
          header: () => null,
          cell: ({ row }: { row: Row<TData> }) => (
            <DragHandle id={row.id} />
          ),
        },
        ...columns,
      ];
    }
    return columns;
  }, [columns, enableDrag]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting: enableSorting ? sorting : [],
      columnVisibility: enableColumnVisibility ? columnVisibility : {},
      rowSelection: enableSelection ? rowSelection : {},
      columnFilters: columnFilters,
      pagination: enablePagination ? pagination : { pageIndex: 0, pageSize: data.length },
      globalFilter: enableSearch ? globalFilter : undefined,
    },
    getRowId: (row: any) => row.id?.toString() || Math.random().toString(),
    enableRowSelection: enableSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: enableColumnVisibility ? setColumnVisibility : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
    onGlobalFilterChange: enableSearch ? setGlobalFilter : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    if (!enableDrag) return;
    
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData(data => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);

  return (
    <div className={`w-full flex-col justify-start gap-6 ${className || ''}`}>
      {/* Toolbar con búsqueda, filtros y acciones */}
      {(enableSearch || enableFilters || enableExport || enableBulkDelete || enableColumnVisibility) && (
        <TableToolbar
          table={table}
          enableSearch={enableSearch}
          enableFilters={enableFilters}
          enableExport={enableExport}
          enableBulkDelete={enableBulkDelete}
          enableColumnVisibility={enableColumnVisibility}
          searchPlaceholder={searchPlaceholder}
          selectedRows={selectedRows}
          onExport={onExport}
          onBulkDelete={onBulkDelete}
        />
      )}

      {/* Header con controles */}
      <TableHeaderComponent
        table={table}
        enableColumnVisibility={enableColumnVisibility}
        addButtonText={addButtonText}
        onAddClick={onAddClick}
      />

      {/* Tabla */}
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          {enableDrag ? (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map(row => (
                        <DraggableRow 
                          key={row.id} 
                          row={row} 
                          enableDrag={enableDrag}
                        />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={finalColumns.length}
                        className="h-24 text-center"
                      >
                        {emptyMessage}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          ) : (
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <DraggableRow 
                      key={row.id} 
                      row={row} 
                      enableDrag={false}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={finalColumns.length}
                      className="h-24 text-center"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Paginación */}
        {enablePagination && <TablePagination table={table} />}
      </div>
    </div>
  );
} 