'use client';

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/tables/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "./data.json";
import { columns } from "@/components/modules/dashboard/columns";

export default function Page() {
  const handleExport = (selectedRows: any[]) => {
    console.log("Exporting:", selectedRows);
    // Aquí implementarías la lógica de exportación
  };

  const handleBulkDelete = async (selectedRows: any[]) => {
    console.log("Deleting:", selectedRows);
    // Aquí implementarías la lógica de eliminación
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable 
            data={data} 
            columns={columns} 
            enableDrag={true}
            enableSelection={true}
            enableSearch={true}
            enableFilters={true}
            enableExport={true}
            enableBulkDelete={true}
            searchPlaceholder="Buscar proyectos..."
            onExport={handleExport}
            onBulkDelete={handleBulkDelete}
          />
        </div>
      </div>
    </div>
  );
}
