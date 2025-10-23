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
    header: "Capacity",
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
    id: "actions",
    cell: ({ row }) => {
      const garage = row.original
      return <UpgradeGarageDialog garage={garage} />
    },
    enableSorting: false,
  },
]
