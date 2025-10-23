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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGarageStore } from "@/store/garage-store"
import { useCompanyStore } from "@/store/company-store"
import { cn } from "@/lib/utils"

interface SelectGarageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleType: 'truck' | 'trailer'
  vehicleBrand: string
  vehicleModel: string
  vehiclePrice: number
  onPurchase: (garageId: number) => Promise<void>
}

export function SelectGarageDialog({
  open,
  onOpenChange,
  vehicleType,
  vehicleBrand,
  vehicleModel,
  vehiclePrice,
  onPurchase,
}: SelectGarageDialogProps) {
  const [selectedGarageId, setSelectedGarageId] = useState<number | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const garages = useGarageStore((state) => state.garages)
  const company = useCompanyStore((state) => state.company)

  // Check if a garage is at capacity
  const isGarageFull = (garage: any) => {
    if (vehicleType === 'truck') {
      return garage.currentTrucks >= garage.capacity
    } else {
      return garage.currentTrailers >= garage.trailerCapacity
    }
  }

  // Check if all garages are full
  const allGaragesFull = garages.length > 0 && garages.every(isGarageFull)

  // Check if company has sufficient funds
  const hasSufficientFunds = company ? company.balance >= vehiclePrice : false

  // Handle purchase
  const handlePurchase = async () => {
    if (!selectedGarageId) return

    setIsPurchasing(true)
    setError(null)

    try {
      await onPurchase(selectedGarageId)
      onOpenChange(false)
      setSelectedGarageId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase vehicle')
    } finally {
      setIsPurchasing(false)
    }
  }

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedGarageId(null)
      setError(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {vehicleType === 'truck' ? 'Select Garage for Truck Purchase' : 'Select Garage for Trailer Purchase'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {vehicleBrand} {vehicleModel} (${vehiclePrice.toLocaleString()})
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {garages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You don&apos;t have any garages yet. Purchase a garage first.
            </div>
          ) : (
            garages
              .sort((a, b) => a.country.localeCompare(b.country))
              .map((garage) => {
                const isFull = isGarageFull(garage)
                const isSelected = selectedGarageId === garage.id

                return (
                  <Card
                    key={garage.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      isFull && "opacity-50 cursor-not-allowed",
                      !isFull && "hover:bg-gray-50",
                      isSelected && "border-2 border-gray-900 bg-gray-100"
                    )}
                    onClick={() => !isFull && setSelectedGarageId(garage.id!)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {garage.country} {isFull && <span className="text-red-600">(FULL)</span>}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Trucks: {garage.currentTrucks}/{garage.capacity} • Trailers: {garage.currentTrailers}/{garage.trailerCapacity}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })
          )}

          {allGaragesFull && (
            <div className="text-center py-4 text-muted-foreground italic text-sm">
              All garages are at {vehicleType} capacity. Upgrade a garage to purchase more.
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handlePurchase}
            disabled={!selectedGarageId || !hasSufficientFunds || isPurchasing}
          >
            {isPurchasing ? 'Purchasing...' : 'Purchase & Assign'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
