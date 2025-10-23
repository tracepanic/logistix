import Dexie, { type Table } from 'dexie'
import type { Company } from '@/types/company'
import type { Garage } from '@/types/garage'
import type { Truck } from '@/types/truck'
import type { Trailer } from '@/types/trailer'

// Dexie database class for LogistixGame
class LogistixDatabase extends Dexie {
  companies!: Table<Company>
  garages!: Table<Garage>
  trucks!: Table<Truck>
  trailers!: Table<Trailer>

  constructor() {
    super('LogistixGameDB')

    // Define database schema version 1
    this.version(1).stores({
      companies: '++id, name, country, balance, createdAt'
    })

    // Define database schema version 2
    this.version(2).stores({
      companies: '++id, name, country, balance, createdAt',
      garages: '++id, companyId, country, [companyId+country], capacity, currentTrucks, purchasePrice, totalInvestment, createdAt'
    })

    // Define database schema version 3
    this.version(3).stores({
      companies: '++id, name, country, balance, createdAt',
      garages: '++id, companyId, country, [companyId+country], capacity, currentTrucks, trailerCapacity, currentTrailers, purchasePrice, totalInvestment, createdAt',
      trucks: 'id, companyId, garageId, truckId, mileage, condition, purchasePrice, purchasedAt',
      trailers: 'id, companyId, garageId, trailerId, mileage, condition, purchasePrice, purchasedAt'
    }).upgrade(async (tx) => {
      // Migration: add trailer fields to existing garages
      const garages = await tx.table('garages').toArray()
      for (const garage of garages) {
        if (garage.trailerCapacity === undefined || garage.currentTrailers === undefined) {
          await tx.table('garages').update(garage.id, {
            trailerCapacity: Math.round(garage.capacity * 1.67),
            currentTrailers: 0
          })
        }
      }
    })
  }
}

// Export singleton instance
export const db = new LogistixDatabase()