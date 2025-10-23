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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div className="container mx-auto py-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{company.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Headquarters</p>
                <p className="text-lg text-muted-foreground">{company.country}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Balance</CardTitle>
                <CardDescription>Current company funds</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {company.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">Coming Soon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">Coming Soon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">Coming Soon</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground">Settings will be available soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
