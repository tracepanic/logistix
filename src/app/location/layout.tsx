'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCompanyStore } from '@/store/company-store'
import { ReactNode } from 'react'

export default function LocationLayout({ children }: { children: ReactNode }) {
  const { company } = useCompanyStore()
  const router = useRouter()

  useEffect(() => {
    if (!company) {
      router.replace('/company/manage')
    }
  }, [company, router])

  // Redirect if no company (render null while redirecting)
  if (!company) {
    return null
  }

  // Company exists, render children
  return children
}
