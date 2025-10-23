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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGarageStore } from "@/store/garage-store"
import { useCompanyStore } from "@/store/company-store"

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

  // Filter available garages (exclude full ones)
  const availableGarages = garages
    .filter((garage) => !isGarageFull(garage))
    .sort((a, b) => a.country.localeCompare(b.country))

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
            <>
              {allGaragesFull && (
                <div className="text-red-600 text-sm text-center border border-red-600 rounded p-3 bg-red-50 mb-3">
                  {vehicleType === 'truck' 
                    ? 'All garages are at full truck capacity. Please expand an existing garage or purchase a new one.'
                    : 'All garages are at full trailer capacity. Please expand an existing garage or purchase a new one.'}
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Garage</label>
                <Select onValueChange={(value) => setSelectedGarageId(Number(value))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a garage..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGarages.map((garage) => (
                      <SelectItem key={garage.id} value={String(garage.id)}>
                        {vehicleType === 'truck'
                          ? `${garage.country} (${garage.currentTrucks}/${garage.capacity} trucks)`
                          : `${garage.country} (${garage.currentTrailers}/${garage.trailerCapacity} trailers)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
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
