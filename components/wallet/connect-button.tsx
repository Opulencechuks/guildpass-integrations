"use client"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from '@wagmi/connectors'
import { Button } from '@/components/ui/button'

export function ConnectButton() {
  const { isConnected, address } = useAccount()
  const { connect, isPending } = useConnect({
    connector: new InjectedConnector()
  })
  const { disconnect } = useDisconnect()

  if (isConnected) {
    const short = `${address?.slice(0, 6)}…${address?.slice(-4)}`
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{short}</span>
        <Button variant="secondary" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button size="sm" onClick={() => connect()} disabled={isPending}>
      {isPending ? 'Connecting…' : 'Connect Wallet'}
    </Button>
  )
}
