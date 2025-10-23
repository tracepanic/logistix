'use client'

import { useEffect } from 'react'
import { useCompanyStore } from '@/store/company-store'
import { ReactNode } from 'react'

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { loadCompany } = useCompanyStore()

  useEffect(() => {
    loadCompany()
  }, [loadCompany])

  return children
}
