import { create } from 'zustand'
import { db } from '@/lib/db'
import type { Trailer } from '@/types/trailer'
import { useCompanyStore } from './company-store'
import { useGarageStore } from './garage-store'

interface TrailerStore {
  // State
  trailers: Trailer[]
  isLoading: boolean
  error: string | null

  // Actions
  loadTrailers: (companyId: number) => Promise<void>
  purchaseTrailer: (companyId: number, garageId: number, trailerId: string, price: number) => Promise<void>
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useTrailerStore = create<TrailerStore>((set, get) => ({
  // Initial state
  trailers: [],
  isLoading: false,
  error: null,

  // Load trailers from IndexedDB
  loadTrailers: async (companyId: number) => {
    set({ isLoading: true, error: null })
    try {
      const trailers = await db.trailers
        .where('companyId')
        .equals(companyId)
        .toArray()
      set({ trailers, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load trailers',
        isLoading: false
      })
    }
  },

  // Purchase trailer
  purchaseTrailer: async (companyId: number, garageId: number, trailerId: string, price: number) => {
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

      // Validate garage trailer capacity
      if (garage.currentTrailers >= garage.trailerCapacity) {
        throw new Error('Garage at trailer capacity')
      }

      // Create trailer record
      const newTrailer: Trailer = {
        id: crypto.randomUUID(),
        companyId,
        garageId,
        trailerId,
        mileage: 0,
        condition: 100,
        purchasePrice: price,
        purchasedAt: new Date()
      }

      // Insert into database
      await db.trailers.add(newTrailer)

      // Increment garage currentTrailers
      await db.garages.update(garageId, {
        currentTrailers: garage.currentTrailers + 1
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

      // Reload trailers and garages
      await get().loadTrailers(companyId)
      await useGarageStore.getState().loadGarages(companyId)

      set({ isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to purchase trailer'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  // Update loading state
  setLoading: (isLoading: boolean) => set({ isLoading }),

  // Update error state
  setError: (error: string | null) => set({ error })
}))
