'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCompanyStore } from '@/store/company-store'
import { ReactNode } from 'react'

export default function LocationLayout({ children }: { children: ReactNode }) {
  const { company, isLoading } = useCompanyStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !company) {
      router.replace('/company/manage')
    }
  }, [company, isLoading, router])

  // Wait for loading to complete
  if (isLoading) {
    return null
  }

  // Redirect if no company (render null while redirecting)
  if (!company) {
    return null
  }

  // Company exists, render children
  return children
}
