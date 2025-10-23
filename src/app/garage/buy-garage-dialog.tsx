"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useGarageStore } from "@/store/garage-store"
import { useCompanyStore } from "@/store/company-store"
import countries from "@/data/countries.json"

const formSchema = z.object({
  country: z.string().min(1, "Please select a country"),
})

type FormValues = z.infer<typeof formSchema>

export function BuyGarageDialog() {
  const [open, setOpen] = useState(false)
  const company = useCompanyStore((state) => state.company)
  const garages = useGarageStore((state) => state.garages)
  const createGarage = useGarageStore((state) => state.createGarage)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
    },
  })

  // Filter out countries where garage already exists
  const ownedCountries = garages.map((g) => g.country)
  const availableCountries = countries.europe.filter(
    (country) => !ownedCountries.includes(country)
  )

  const onSubmit = async (values: FormValues) => {
    if (!company) {
      form.setError("country", {
        message: "No company found",
      })
      return
    }

    // Validate balance
    if (company.balance < 25000) {
      form.setError("country", {
        message: "Insufficient balance. You need $25,000 to purchase a garage.",
      })
      return
    }

    try {
      await createGarage({
        companyId: company.id!,
        country: values.country,
        capacity: 3,
        currentTrucks: 0,
        purchasePrice: 25000,
        totalInvestment: 25000,
      })

      // Success - close dialog and reset form
      setOpen(false)
      form.reset()
    } catch (error) {
      form.setError("country", {
        message: error instanceof Error ? error.message : "Failed to purchase garage",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Buy New Garage</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Buy New Garage</AlertDialogTitle>
          <AlertDialogDescription>
            Purchase a new garage to store and manage your trucks. Base capacity: 3 trucks.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCountries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm space-y-1">
              <p>
                <strong>Cost:</strong> $25,000
              </p>
              <p>
                <strong>Starting capacity:</strong> 3 trucks
              </p>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit">Purchase Garage</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
