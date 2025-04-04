import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { BrowserRouter } from "react-router"
import { SidebarProvider } from "@/components/ui/sidebar"

interface AppProviderProps {
  children: React.ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>{children}</SidebarProvider>
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </BrowserRouter>
  )
}
