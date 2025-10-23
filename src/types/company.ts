// Company interface matching database schema
export interface Company {
  id?: number              // Optional for creation, auto-increment
  name: string
  balance: number
  createdAt: Date
}
