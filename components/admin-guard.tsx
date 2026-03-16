"use client"
import { ReactNode } from "react"
import { useAccount } from "wagmi"
import { useQuery } from "@tanstack/react-query"
import { getApi } from "@/lib/api"
import { AccessDenied } from "./gated"

export function AdminGuard({ children }: { children: ReactNode }) {
  const { address } = useAccount()
  const { data: session, isLoading } = useQuery({
    queryKey: ['session', address],
    queryFn: () => getApi(address).getSession(),
    enabled: !!address
  })
  if (!address) return <AccessDenied reason="Admin area requires wallet connection." />
  if (isLoading) return <div className="text-sm text-muted-foreground">Checking admin access…</div>
  if (!session?.roles?.includes('admin')) return <AccessDenied reason="Admin privileges are required." />
  return <>{children}</>
}
