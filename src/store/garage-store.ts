import { create } from 'zustand'
import { db } from '@/lib/db'
import type { Garage } from '@/types/garage'
import { useCompanyStore } from './company-store'

interface GarageStore {
  // State
  garages: Garage[]
  isLoading: boolean
  error: string | null

  // Actions
  loadGarages: (companyId: number) => Promise<void>
  createGarage: (garage: Omit<Garage, 'id' | 'createdAt'>) => Promise<Garage>
  upgradeGarage: (garageId: number, tierSize: 3 | 6 | 10, cost: number) => Promise<void>
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useGarageStore = create<GarageStore>((set, get) => ({
  // Initial state
  garages: [],
  isLoading: false,
  error: null,

  // Load garages from IndexedDB
  loadGarages: async (companyId: number) => {
    set({ isLoading: true, error: null })
    try {
      const garages = await db.garages
        .where('companyId')
        .equals(companyId)
        .toArray()
      set({ garages, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load garages',
        isLoading: false
      })
    }
  },

  // Create new garage
  createGarage: async (garage: Omit<Garage, 'id' | 'createdAt'>) => {
    set({ isLoading: true, error: null })
    try {
      // Validate balance
      const company = useCompanyStore.getState().company
      if (!company || company.balance < 25000) {
        throw new Error('Insufficient balance. You need $25,000 to purchase a garage.')
      }

      // Check if garage already exists in this country
      const existing = await db.garages
        .where(['companyId', 'country'])
        .equals([garage.companyId, garage.country])
        .first()
      if (existing) {
        throw new Error('A garage already exists in this country')
      }

      // Create garage
      const newGarage: Omit<Garage, 'id'> = {
        ...garage,
        createdAt: new Date().toISOString()
      }
      const id = await db.garages.add(newGarage)

      // Deduct balance from company
      await db.companies.update(company.id!, {
        balance: company.balance - 25000
      })

      // Update company store
      useCompanyStore.getState().setCompany({
        ...company,
        balance: company.balance - 25000
      })

      // Add to state
      const createdGarage = { ...newGarage, id: Number(id) }
      set({
        garages: [...get().garages, createdGarage],
        isLoading: false
      })

      return createdGarage as Garage
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create garage'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  // Upgrade garage capacity
  upgradeGarage: async (garageId: number, tierSize: 3 | 6 | 10, cost: number) => {
    set({ isLoading: true, error: null })
    try {
      // Get garage
      const garage = await db.garages.get(garageId)
      if (!garage) {
        throw new Error('Garage not found')
      }

      // Validate balance
      const company = useCompanyStore.getState().company
      if (!company || company.balance < cost) {
        throw new Error('Insufficient balance')
      }

      // Calculate new values
      const newCapacity = garage.capacity + tierSize
      const newTrailerCapacity = Math.round(newCapacity * 1.67)
      const newTotalInvestment = garage.totalInvestment + cost

      // Update garage
      await db.garages.update(garageId, {
        capacity: newCapacity,
        trailerCapacity: newTrailerCapacity,
        totalInvestment: newTotalInvestment
      })

      // Deduct balance from company
      await db.companies.update(company.id!, {
        balance: company.balance - cost
      })

      // Update company store
      useCompanyStore.getState().setCompany({
        ...company,
        balance: company.balance - cost
      })

      // Update state
      set({
        garages: get().garages.map(g =>
          g.id === garageId
            ? { ...g, capacity: newCapacity, trailerCapacity: newTrailerCapacity, totalInvestment: newTotalInvestment }
            : g
        ),
        isLoading: false
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upgrade garage'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  // Update loading state
  setLoading: (isLoading: boolean) => set({ isLoading }),

  // Update error state
  setError: (error: string | null) => set({ error })
}))
