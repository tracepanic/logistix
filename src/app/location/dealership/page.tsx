'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import trucksData from '@/data/trucks.json'
import trailersData from '@/data/trailers.json'
import { useCompanyStore } from '@/store/company-store'
import { useGarageStore } from '@/store/garage-store'
import { useTruckStore } from '@/store/truck-store'
import { useTrailerStore } from '@/store/trailer-store'
import { SelectGarageDialog } from './select-garage-dialog'

interface SelectedVehicle {
  type: 'truck' | 'trailer'
  id: string
  brand?: string
  model?: string
  name?: string
  price: number
}

export default function DealershipPage() {
  const [showTruckDialog, setShowTruckDialog] = useState(false)
  const [showTrailerDialog, setShowTrailerDialog] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null)

  const company = useCompanyStore((state) => state.company)
  const loadCompany = useCompanyStore((state) => state.loadCompany)
  const loadGarages = useGarageStore((state) => state.loadGarages)
  const loadTrucks = useTruckStore((state) => state.loadTrucks)
  const loadTrailers = useTrailerStore((state) => state.loadTrailers)
  const purchaseTruck = useTruckStore((state) => state.purchaseTruck)
  const purchaseTrailer = useTrailerStore((state) => state.purchaseTrailer)

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await loadCompany()
      const currentCompany = useCompanyStore.getState().company
      if (currentCompany?.id) {
        await loadGarages(currentCompany.id)
        await loadTrucks(currentCompany.id)
        await loadTrailers(currentCompany.id)
      }
    }
    loadData()
  }, [loadCompany, loadGarages, loadTrucks, loadTrailers])

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="trucks" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="trucks">Trucks</TabsTrigger>
          <TabsTrigger value="trailers">Trailers</TabsTrigger>
        </TabsList>

        <TabsContent value="trucks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trucksData.trucks.sort((a, b) => a.price_usd - b.price_usd).map((truck) => (
              <Card key={truck.id}>
                <CardHeader>
                  <CardDescription>{truck.brand}</CardDescription>
                  <CardTitle>{truck.model}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Horsepower</p>
                      <p className="text-base font-semibold">{truck.horsepower} HP</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Max Load</p>
                      <p className="text-base font-semibold">{truck.max_load_tons} tons</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Fuel Usage</p>
                      <p className="text-base font-semibold">{truck.fuel_consumption_l_per_100km} L/100km</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Fuel Capacity</p>
                      <p className="text-base font-semibold">{truck.fuel_capacity_l} L</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Top Speed</p>
                      <p className="text-base font-semibold">{truck.speed_kmh} km/h</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Maintenance</p>
                      <p className="text-base font-semibold">${truck.maintenance_cost_usd_per_km}/km</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Price</p>
                    <p className="text-2xl font-bold">${truck.price_usd.toLocaleString('en-US')}</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedVehicle({
                        type: 'truck',
                        brand: truck.brand,
                        model: truck.model,
                        id: truck.id,
                        price: truck.price_usd
                      })
                      setShowTruckDialog(true)
                    }}
                  >
                    Purchase Truck
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trailers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trailersData.trailers.map((trailer) => (
              <Card key={trailer.id}>
                <CardHeader>
                  <CardTitle>{trailer.name}</CardTitle>
                  <CardDescription>{trailer.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Required HP</p>
                      <p className="text-base font-semibold">{trailer.required_hp} HP</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Freight Points</p>
                      <p className="text-base font-semibold">{trailer.freight_points} pts</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Level Required</p>
                      <p className="text-base font-semibold">Level {trailer.level_required}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Cargo Types</p>
                    <div className="flex flex-wrap gap-2">
                      {trailer.cargo_types.map((cargoType) => (
                        <span key={cargoType} className="text-xs bg-secondary px-2 py-1 rounded">
                          {cargoType.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Price</p>
                    <p className="text-2xl font-bold">${trailer.price_usd.toLocaleString('en-US')}</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedVehicle({
                        type: 'trailer',
                        name: trailer.name,
                        id: trailer.id,
                        price: trailer.price_usd
                      })
                      setShowTrailerDialog(true)
                    }}
                  >
                    Purchase Trailer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedVehicle?.type === 'truck' && (
        <SelectGarageDialog
          open={showTruckDialog}
          onOpenChange={setShowTruckDialog}
          vehicleType="truck"
          vehicleBrand={selectedVehicle.brand || ''}
          vehicleModel={selectedVehicle.model || ''}
          vehiclePrice={selectedVehicle.price}
          onPurchase={async (garageId) => {
            if (company?.id) {
              await purchaseTruck(company.id, garageId, selectedVehicle.id, selectedVehicle.price)
            }
          }}
        />
      )}

      {selectedVehicle?.type === 'trailer' && (
        <SelectGarageDialog
          open={showTrailerDialog}
          onOpenChange={setShowTrailerDialog}
          vehicleType="trailer"
          vehicleBrand={selectedVehicle.name || ''}
          vehicleModel=""
          vehiclePrice={selectedVehicle.price}
          onPurchase={async (garageId) => {
            if (company?.id) {
              await purchaseTrailer(company.id, garageId, selectedVehicle.id, selectedVehicle.price)
            }
          }}
        />
      )}
    </div>
  )
}
