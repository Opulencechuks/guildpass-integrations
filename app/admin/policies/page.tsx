"use client"
import { useAccount } from "wagmi"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getApi, type AccessPolicy } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminGuard } from "@/components/admin-guard"

export default function PoliciesPage() {
  const { address } = useAccount()
  const qc = useQueryClient()
  const { data: policies } = useQuery<AccessPolicy[]>({
    queryKey: ['policies'],
    queryFn: () => getApi(address).listPolicies()
  })
  const { mutate, isPending } = useMutation({
    mutationFn: (p: AccessPolicy) => getApi(address).updatePolicy(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['policies'] })
  })
  return (
    <AdminGuard>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Access Policies</h1>
        <Card>
          <CardHeader><CardTitle>Resources</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {policies?.map(p => (
              <div key={p.resourceId} className="flex items-center gap-2">
                <div className="w-40 text-sm">{p.resourceId}</div>
                <select className="border rounded-md h-9 px-2 text-sm" value={p.minTier ?? 'free'} onChange={e => mutate({ ...p, minTier: e.target.value as any })} disabled={isPending}>
                  <option value="free">free</option>
                  <option value="standard">standard</option>
                  <option value="pro">pro</option>
                </select>
                <Button variant="outline" size="sm" onClick={() => mutate({ ...p })} disabled={isPending}>Save</Button>
              </div>
            ))}
            {!policies?.length && <div className="text-sm text-muted-foreground">No resources configured.</div>}
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  )
}
