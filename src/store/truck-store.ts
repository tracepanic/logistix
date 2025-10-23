import { create } from 'zustand'
import { db } from '@/lib/db'
import type { Truck } from '@/types/truck'
import { useCompanyStore } from './company-store'
import { useGarageStore } from './garage-store'

interface TruckStore {
  // State
  trucks: Truck[]
  isLoading: boolean
  error: string | null

  // Actions
  loadTrucks: (companyId: number) => Promise<void>
  purchaseTruck: (companyId: number, garageId: number, truckId: string, price: number) => Promise<void>
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useTruckStore = create<TruckStore>((set, get) => ({
  // Initial state
  trucks: [],
  isLoading: false,
  error: null,

  // Load trucks from IndexedDB
  loadTrucks: async (companyId: number) => {
    set({ isLoading: true, error: null })
    try {
      const trucks = await db.trucks
        .where('companyId')
        .equals(companyId)
        .toArray()
      set({ trucks, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load trucks',
        isLoading: false
      })
    }
  },

  // Purchase truck
  purchaseTruck: async (companyId: number, garageId: number, truckId: string, price: number) => {
    set({ isLoading: true, error: null })
    try {
      // Get company balance
      const company = useCompanyStore.getState().company
      if (!company) {
        throw new Error('Company not found')
      }

      // Validate balance
      if (company.balance < price) {
        throw new Error('Insufficient funds')
      }

      // Get garage
      const garage = await db.garages.get(garageId)
      if (!garage) {
        throw new Error('Garage not found')
      }

      // Validate garage capacity
      if (garage.currentTrucks >= garage.capacity) {
        throw new Error('Garage at truck capacity')
      }

      // Create truck record
      const newTruck: Truck = {
        id: crypto.randomUUID(),
        companyId,
        garageId,
        truckId,
        mileage: 0,
        condition: 100,
        purchasePrice: price,
        purchasedAt: new Date()
      }

      // Insert into database
      await db.trucks.add(newTruck)

      // Increment garage currentTrucks
      await db.garages.update(garageId, {
        currentTrucks: garage.currentTrucks + 1
      })

      // Deduct price from company balance
      await db.companies.update(company.id!, {
        balance: company.balance - price
      })

      // Update company store
      useCompanyStore.getState().setCompany({
        ...company,
        balance: company.balance - price
      })

      // Reload trucks and garages
      await get().loadTrucks(companyId)
      await useGarageStore.getState().loadGarages(companyId)

      set({ isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to purchase truck'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  // Update loading state
  setLoading: (isLoading: boolean) => set({ isLoading }),

  // Update error state
  setError: (error: string | null) => set({ error })
}))
