'use client'

import type { ReactNode } from 'react';

import { ThemeProvider } from 'next-themes';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/components/app-sidebar';
import { CompanyProvider } from '@/providers/company-provider';
import { useCompanyStore } from '@/store/company-store';
import { Spinner } from '@/components/ui/spinner';

export function ClientLayout({ children }: { children: ReactNode }) {
    const isLoading = useCompanyStore((state) => state.isLoading);

    return (
        // ? https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
        // ? https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors
        <ThemeProvider attribute='class'>
            <SidebarProvider>
                <CompanyProvider>
                    {isLoading ? (
                        <div className="flex items-center justify-center min-h-screen">
                            <Spinner className="size-8" />
                        </div>
                    ) : (
                        <>
                            <AppSidebar />
                            <SidebarInset>
                                <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-4 relative">
                                    <div className="flex items-center gap-2">
                                        <SidebarTrigger className="-ml-1" />
                                        <Separator orientation="vertical" className="mr-2 h-4" />
                                    </div>
                                    <span className="font-semibold text-lg absolute left-1/2 -translate-x-1/2">LogistiX</span>
                                </header>
                                <Separator orientation="horizontal" />
                                <div className="w-full h-full p-4 pt-0 mb-36">{children}</div>
                            </SidebarInset>
                        </>
                    )}
                </CompanyProvider>
            </SidebarProvider>
        </ThemeProvider>
    );
}
