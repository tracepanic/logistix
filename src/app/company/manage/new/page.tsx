'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCompanyStore } from '@/store/company-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Form validation schema
const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(50, { message: "Company name must be less than 50 characters" })
    .refine((val) => val.trim().length >= 2, {
      message: "Company name is required"
    })
})

type FormData = z.infer<typeof formSchema>

export default function NewCompanyPage() {
  const router = useRouter()
  const { company, isLoading, loadCompany, createCompany } = useCompanyStore()

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  })

  // Load company on mount
  useEffect(() => {
    loadCompany()
  }, [loadCompany])

  // Redirect if company already exists
  useEffect(() => {
    if (company) {
      router.push('/company/manage')
    }
  }, [company, router])

  // Form submission handler
  async function onSubmit(values: FormData) {
    const createdCompany = await createCompany(values.name.trim())
    if (createdCompany) {
      router.push('/company/manage')
    }
  }

  // Show loading while checking if company exists
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Checking...</p>
      </div>
    )
  }

  // Show nothing while redirecting (company exists)
  if (company) {
    return null
  }

  // Show form when no company exists
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-full max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Company</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating..." : "Create Company"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
