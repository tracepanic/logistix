'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCompanyStore } from '@/store/company-store'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { Building2 } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function ManageCompanyPage() {
  const { company, isLoading, loadCompany } = useCompanyStore()

  useEffect(() => {
    loadCompany()
  }, [loadCompany])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2 size={48} strokeWidth={1.5} />
            </EmptyMedia>
            <EmptyTitle>No Company Found</EmptyTitle>
            <EmptyDescription>
              Get started by creating your first company to begin managing your logistics business.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/company/manage/new">
              <Button>Create New Company</Button>
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">company available</h1>
      <p className="text-lg">{company.name}</p>
      <p className="text-muted-foreground">Balance: {company.balance}</p>
    </div>
  )
}
