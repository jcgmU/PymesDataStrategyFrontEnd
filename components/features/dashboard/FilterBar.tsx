"use client";

import { useShallow } from "zustand/react/shallow";
import { Search } from "lucide-react";
import { useAppStore } from "@/store";
import { DATASET_STATUS, type DatasetStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusOptions: { value: DatasetStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos los estados" },
  { value: DATASET_STATUS.PENDING, label: "Pendiente" },
  { value: DATASET_STATUS.PROCESSING, label: "Procesando" },
  { value: DATASET_STATUS.READY, label: "Listo" },
  { value: DATASET_STATUS.ERROR, label: "Error" },
  { value: DATASET_STATUS.ARCHIVED, label: "Archivado" },
];

export function FilterBar() {
  const { filter, setFilter } = useAppStore(
    useShallow((state) => ({
      filter: state.filter,
      setFilter: state.setFilter,
    }))
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          className={cn(
            "w-full pl-10 pr-4 py-2",
            "bg-surface text-text placeholder:text-text-muted",
            "border-2 border-black rounded-md",
            "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
            "transition-shadow duration-150"
          )}
        />
      </div>

      {/* Status Select */}
      <select
        value={filter.status}
        onChange={(e) =>
          setFilter({ status: e.target.value as DatasetStatus | "ALL" })
        }
        className={cn(
          "px-4 py-2 min-w-[180px]",
          "bg-surface text-text",
          "border-2 border-black rounded-md",
          "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
          "cursor-pointer appearance-none",
          "transition-shadow duration-150"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
          paddingRight: "2.5rem",
        }}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
