'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import trucksData from '@/data/trucks.json'
import trailersData from '@/data/trailers.json'

export default function DealershipPage() {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="trucks" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="trucks">Trucks</TabsTrigger>
          <TabsTrigger value="trailers">Trailers</TabsTrigger>
        </TabsList>

        <TabsContent value="trucks" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {trucksData.trucks.map((truck) => (
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
                  <Button className="w-full">Purchase Truck</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trailers" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
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
                          {cargoType.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Price</p>
                    <p className="text-2xl font-bold">${trailer.price_usd.toLocaleString('en-US')}</p>
                  </div>
                  <Button className="w-full">Purchase Trailer</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
