import Dexie, { type Table } from 'dexie'
import type { Company } from '@/types/company'

// Dexie database class for LogistixGame
class LogistixDatabase extends Dexie {
  companies!: Table<Company>

  constructor() {
    super('LogistixGameDB')

    // Define database schema version 1
    this.version(1).stores({
      companies: '++id, name, balance, createdAt'
    })
  }
}

// Export singleton instance
export const db = new LogistixDatabase()
