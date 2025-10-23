import Dexie, { type Table } from 'dexie'
import type { Company } from '@/types/company'
import type { Garage } from '@/types/garage'

// Dexie database class for LogistixGame
class LogistixDatabase extends Dexie {
  companies!: Table<Company>
  garages!: Table<Garage>

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
  }
}

// Export singleton instance
export const db = new LogistixDatabase()