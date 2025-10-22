"use client"

import * as React from "react"
import Link from "next/link"
import { Truck, Building2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const items = [
    {
      title: "My Company",
      url: "/company",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Manage Company",
          url: "/company/manage",
        },
      ],
    },
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Truck />
                <span>LogistiX</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
    </Sidebar>
  )
}
