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
            "bg-white text-[#1e293b] placeholder:text-[#64748b]",
            "border border-[#e2e8f0] rounded-lg",
            "focus:outline-none focus:border-[#ff6600] focus:ring-[3px] focus:ring-[rgba(255,102,0,.12)]",
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
          "bg-white text-[#1e293b]",
          "border border-[#e2e8f0] rounded-lg",
          "focus:outline-none focus:border-[#ff6600] focus:ring-[3px] focus:ring-[rgba(255,102,0,.12)]",
          "cursor-pointer appearance-none",
          "transition-shadow duration-150"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
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
