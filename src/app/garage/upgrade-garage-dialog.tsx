"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useGarageStore } from "@/store/garage-store"
import { useCompanyStore } from "@/store/company-store"
import { Garage } from "@/types/garage"

interface UpgradeGarageDialogProps {
  garage: Garage
}

interface UpgradeTier {
  increase: number
  newCapacity: number
  price: number
}

const calculateUpgradePrices = (currentCapacity: number) => {
  const basePrice = 5000 * (1 + Math.log(currentCapacity + 3))

  return {
    small: {
      increase: 3,
      newCapacity: currentCapacity + 3,
      price: Math.round(basePrice),
    },
    medium: {
      increase: 6,
      newCapacity: currentCapacity + 6,
      price: Math.round(basePrice * 2.5),
    },
    large: {
      increase: 10,
      newCapacity: currentCapacity + 10,
      price: Math.round(basePrice * 4),
    },
  }
}

export function UpgradeGarageDialog({ garage }: UpgradeGarageDialogProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const company = useCompanyStore((state) => state.company)
  const upgradeGarage = useGarageStore((state) => state.upgradeGarage)

  const prices = calculateUpgradePrices(garage.capacity)

  const handleUpgrade = async (tierSize: 3 | 6 | 10, cost: number) => {
    setError(null)

    // Check balance
    if (!company || company.balance < cost) {
      setError("Insufficient balance")
      return
    }

    try {
      await upgradeGarage(garage.id!, tierSize, cost)
      setOpen(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upgrade garage")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Upgrade</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upgrade Garage - {garage.country}</AlertDialogTitle>
          <AlertDialogDescription>
            Current: {garage.currentTrucks}/{garage.capacity} trucks | Select upgrade tier:
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 px-4 flex flex-col items-start"
            onClick={() => handleUpgrade(3, prices.small.price)}
          >
            <div className="font-bold text-base">Small Upgrade (+3 trucks)</div>
            <div className="text-sm text-muted-foreground">
              New capacity: {prices.small.newCapacity} trucks
            </div>
            <div className="font-semibold text-sm mt-1">
              Cost: ${prices.small.price.toLocaleString()}
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 px-4 flex flex-col items-start"
            onClick={() => handleUpgrade(6, prices.medium.price)}
          >
            <div className="font-bold text-base">Medium Upgrade (+6 trucks)</div>
            <div className="text-sm text-muted-foreground">
              New capacity: {prices.medium.newCapacity} trucks
            </div>
            <div className="font-semibold text-sm mt-1">
              Cost: ${prices.medium.price.toLocaleString()}
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 px-4 flex flex-col items-start"
            onClick={() => handleUpgrade(10, prices.large.price)}
          >
            <div className="font-bold text-base">Large Upgrade (+10 trucks)</div>
            <div className="text-sm text-muted-foreground">
              New capacity: {prices.large.newCapacity} trucks
            </div>
            <div className="font-semibold text-sm mt-1">
              Cost: ${prices.large.price.toLocaleString()}
            </div>
          </Button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
