import { IconChevronDown, IconLayoutColumns, IconPlus } from "@tabler/icons-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableHeaderProps<TData> {
  table: Table<TData>;
  enableColumnVisibility?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
}

export function TableHeader<TData>({
  table,
  enableColumnVisibility = true,
  addButtonText = "Add Item",
  onAddClick,
}: TableHeaderProps<TData>) {
  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <div />
      <div className="flex items-center gap-2">
        {onAddClick && (
          <Button variant="outline" size="sm" onClick={onAddClick}>
            <IconPlus />
            <span className="hidden lg:inline">{addButtonText}</span>
          </Button>
        )}
      </div>
    </div>
  );
} 