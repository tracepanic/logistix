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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useGarageStore } from "@/store/garage-store"
import { useCompanyStore } from "@/store/company-store"
import { Garage } from "@/types/garage"
import { cn } from "@/lib/utils"

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
  const [selectedTier, setSelectedTier] = useState<'small' | 'medium' | 'large' | null>(null)
  const company = useCompanyStore((state) => state.company)
  const upgradeGarage = useGarageStore((state) => state.upgradeGarage)

  const prices = calculateUpgradePrices(garage.capacity)

  const handleUpgrade = async () => {
    setError(null)

    // Return early if no tier selected
    if (!selectedTier) return

    // Map selectedTier to tierSize and cost
    const tierMap = {
      small: { size: 3 as const, cost: prices.small.price },
      medium: { size: 6 as const, cost: prices.medium.price },
      large: { size: 10 as const, cost: prices.large.price },
    }

    const { size: tierSize, cost } = tierMap[selectedTier]

    // Check balance
    if (!company || company.balance < cost) {
      setError("Insufficient balance")
      return
    }

    try {
      await upgradeGarage(garage.id!, tierSize, cost)
      setSelectedTier(null)
      setOpen(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upgrade garage")
    }
  }

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          setSelectedTier(null)
          setError(null)
        }
      }}
    >
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

        <RadioGroup 
          value={selectedTier || undefined} 
          onValueChange={(value) => setSelectedTier(value as 'small' | 'medium' | 'large')}
          className="flex flex-col gap-3"
        >
          <Label 
            htmlFor="tier-small" 
            className={cn(
              "h-auto py-4 px-4 flex items-center gap-3 border-2 rounded-md cursor-pointer hover:bg-accent",
              selectedTier === 'small' ? 'border-primary' : 'border-input'
            )}
          >
            <RadioGroupItem value="small" id="tier-small" />
            <div className="flex flex-col gap-1 flex-1">
              <div className="font-bold text-base">Small Upgrade (+3 trucks)</div>
              <div className="text-sm text-muted-foreground">
                New capacity: {prices.small.newCapacity} trucks
              </div>
              <div className="font-semibold text-sm">
                Cost: ${prices.small.price.toLocaleString()}
              </div>
            </div>
          </Label>

          <Label 
            htmlFor="tier-medium" 
            className={cn(
              "h-auto py-4 px-4 flex items-center gap-3 border-2 rounded-md cursor-pointer hover:bg-accent",
              selectedTier === 'medium' ? 'border-primary' : 'border-input'
            )}
          >
            <RadioGroupItem value="medium" id="tier-medium" />
            <div className="flex flex-col gap-1 flex-1">
              <div className="font-bold text-base">Medium Upgrade (+6 trucks)</div>
              <div className="text-sm text-muted-foreground">
                New capacity: {prices.medium.newCapacity} trucks
              </div>
              <div className="font-semibold text-sm">
                Cost: ${prices.medium.price.toLocaleString()}
              </div>
            </div>
          </Label>

          <Label 
            htmlFor="tier-large" 
            className={cn(
              "h-auto py-4 px-4 flex items-center gap-3 border-2 rounded-md cursor-pointer hover:bg-accent",
              selectedTier === 'large' ? 'border-primary' : 'border-input'
            )}
          >
            <RadioGroupItem value="large" id="tier-large" />
            <div className="flex flex-col gap-1 flex-1">
              <div className="font-bold text-base">Large Upgrade (+10 trucks)</div>
              <div className="text-sm text-muted-foreground">
                New capacity: {prices.large.newCapacity} trucks
              </div>
              <div className="font-semibold text-sm">
                Cost: ${prices.large.price.toLocaleString()}
              </div>
            </div>
          </Label>
        </RadioGroup>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button 
            type="button" 
            onClick={handleUpgrade}
            disabled={selectedTier === null}
          >
            Confirm Purchase
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
