"use client"
import { Gated } from "@/components/gated"

export default function DemoEvent() {
  return (
    <Gated minTier="free">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Demo Event Access</h1>
        <p className="text-muted-foreground">Members can access this event page.</p>
        <div className="rounded-md border p-4">
          <div className="text-sm">Event ticket placeholder with simple status.</div>
        </div>
      </div>
    </Gated>
  )
}
