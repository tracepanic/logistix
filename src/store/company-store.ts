import { create } from 'zustand'
import { db } from '@/lib/db'
import type { Company } from '@/types/company'

interface CompanyStore {
  // State
  company: Company | null
  isLoading: boolean
  error: string | null

  // Actions
  loadCompany: () => Promise<void>
  createCompany: (name: string, country: string) => Promise<Company | null>
  setCompany: (company: Company | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  // Initial state
  company: null,
  isLoading: false,
  error: null,

  // Load company from IndexedDB
  loadCompany: async () => {
    set({ isLoading: true, error: null })
    try {
      const companies = await db.companies.toArray()
      if (companies.length > 0) {
        set({ company: companies[0], isLoading: false })
      } else {
        set({ company: null, isLoading: false })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load company',
        isLoading: false
      })
    }
  },

  // Create new company
  createCompany: async (name: string, country: string) => {
    set({ isLoading: true, error: null })
    try {
      const companyData = {
        name,
        country,
        balance: 10000,
        createdAt: new Date()
      }

      const id = await db.companies.add(companyData)
      const createdCompany = await db.companies.get(id)

      if (createdCompany) {
        set({ company: createdCompany, isLoading: false })
        return createdCompany
      }

      set({ isLoading: false })
      return null
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create company',
        isLoading: false
      })
      return null
    }
  },

  // Update company state
  setCompany: (company: Company | null) => set({ company }),

  // Update loading state
  setLoading: (isLoading: boolean) => set({ isLoading }),

  // Update error state
  setError: (error: string | null) => set({ error })
}))
