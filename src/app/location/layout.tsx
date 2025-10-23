'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCompanyStore } from '@/store/company-store'
import { ReactNode } from 'react'
import { Spinner } from '@/components/ui/spinner'

export default function LocationLayout({ children }: { children: ReactNode }) {
  const { company } = useCompanyStore()
  const router = useRouter()

  useEffect(() => {
    if (!company) {
      router.replace('/company/manage')
    }
  }, [company, router])

  // Redirect if no company (show spinner while redirecting)
  if (!company) {
    return (
      <div className="flex justify-center mt-40">
        <Spinner className="size-8" />
      </div>
    )
  }

  // Company exists, render children
  return children
}
