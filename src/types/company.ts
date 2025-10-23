// Company interface matching database schema
export interface Company {
  id?: number              // Optional for creation, auto-increment
  name: string
  country: string
  balance: number
  createdAt: Date
}
