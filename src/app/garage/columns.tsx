"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Garage } from "@/types/garage"
import { UpgradeGarageDialog } from "./upgrade-garage-dialog"

export const columns: ColumnDef<Garage>[] = [
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("country")}</div>
    },
  },
  {
    accessorKey: "currentTrucks",
    header: "Trucks",
    cell: ({ row }) => {
      const garage = row.original
      return (
        <div>
          {garage.currentTrucks}/{garage.capacity}
        </div>
      )
    },
  },
  {
    accessorKey: "currentTrailers",
    header: "Trailers",
    cell: ({ row }) => {
      const garage = row.original
      return (
        <div>
          {garage.currentTrailers}/{garage.trailerCapacity}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const garage = row.original
      return (
        <div className="flex justify-end">
          <UpgradeGarageDialog garage={garage} />
        </div>
      )
    },
    enableSorting: false,
  },
]
