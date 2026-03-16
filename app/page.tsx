import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to GuildPass</h1>
      <p className="text-muted-foreground">
        Membership and access control for your community. This is a minimal landing area. Use the navigation to explore the app.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  )
}
