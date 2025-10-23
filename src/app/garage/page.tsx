"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGarageStore } from "@/store/garage-store"
import { useCompanyStore } from "@/store/company-store"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { BuyGarageDialog } from "./buy-garage-dialog"
import { Spinner } from "@/components/ui/spinner"

export default function GaragePage() {
  const router = useRouter()
  const company = useCompanyStore((state) => state.company)
  const companyLoading = useCompanyStore((state) => state.isLoading)
  const { garages, isLoading, loadGarages } = useGarageStore()

  // Check if company exists, redirect if not
  useEffect(() => {
    if (!companyLoading && !company) {
      router.push("/company/manage")
    }
  }, [company, companyLoading, router])

  // Load garages when company is available
  useEffect(() => {
    if (company?.id) {
      loadGarages(company.id)
    }
  }, [company?.id, loadGarages])

  // Show loading state
  if (companyLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="size-6" />
      </div>
    )
  }

  // Don't render if no company (will redirect)
  if (!company) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Garages</h1>
        <BuyGarageDialog />
      </div>
      <DataTable columns={columns} data={garages} />
    </div>
  )
}
