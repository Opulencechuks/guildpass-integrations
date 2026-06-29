'use client'

import { ReactNode, useState } from 'react'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@/lib/api'
import { AccessDenied } from './gated'
import { useSiweAuth } from '@/lib/wallet/providers'
import { queryKeys } from '@/lib/query'
import { Button } from './ui/button'
import { LoadingState, ErrorState, safeErrorMessage } from './ui/api-states'
import { config } from '@/lib/config'
import { formatAddress } from '@/lib/wallet/address'

function SiwePrompt() {
  const { address } = useAccount()
  const { signIn, isSigningIn, error } = useSiweAuth()
  const [showPreview, setShowPreview] = useState(false)
  
  const currentHost = typeof window !== 'undefined' ? window.location.host : ''
  const domainMismatch = config.siwe.domain !== currentHost

  const siweMessage = [
    `${config.siwe.domain} wants you to sign in with your Ethereum account:`,
    address ?? '',
    '',
    config.siwe.statement,
    '',
    `URI: ${typeof window !== 'undefined' ? window.location.origin : `https://${config.siwe.domain}`}`,
    `Version: 1`,
    `Chain ID: 1`,
    `Nonce: [requested from backend]`,
    `Issued At: ${new Date().toISOString()}`,
  ].join('\n')

  return (
    <div className="rounded-md border p-6 max-w-md space-y-4">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z"
          />
        </svg>
        <div className="flex-1">
          <h2 className="text-base font-semibold">Admin Verification Required</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            To access the admin panel, you need to prove you own this wallet by signing
            a one-time message. This is a{' '}
            <strong className="font-medium">gasless, off-chain</strong> signature — it
            does not cost any ETH and does not execute a transaction.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>Your signature is verified by our backend to issue a secure session token.</li>
            <li>The session expires automatically after 1 hour.</li>
            <li>You can sign out at any time from the navigation bar.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        {address && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Connected Wallet</span>
            <span className="font-mono">{formatAddress(address)}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Domain</span>
          <span className="font-mono">{config.siwe.domain}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Statement</span>
          <span className="text-right max-w-xs truncate">{config.siwe.statement}</span>
        </div>
      </div>

      {domainMismatch && (
        <div className="p-3 rounded-md border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            ⚠️ Domain Mismatch Warning
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            Configured domain <span className="font-mono">{config.siwe.domain}</span> does not match current host <span className="font-mono">{currentHost}</span>. This may cause signature verification to fail.
          </p>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          {showPreview ? 'Hide message preview' : 'Show message preview'}
        </button>
        {showPreview && (
          <div className="mt-2 p-3 bg-muted rounded-md font-mono text-xs whitespace-pre-wrap">
            {siweMessage}
          </div>
        )}
      </div>

      {error && (
        <p id="siwe-prompt-error" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        id="siwe-prompt-signin-btn"
        onClick={signIn}
        disabled={isSigningIn}
        className="w-full sm:w-auto"
      >
        {isSigningIn ? (
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Waiting for signature…
          </span>
        ) : (
          'Sign Message to Continue'
        )}
      </Button>
    </div>
  )
}

/** Shown when the guard detects an expired session — prompts re-authentication. */
function ExpiredSessionPrompt() {
  const { signIn, isSigningIn, error } = useSiweAuth()
  return (
    <div id="admin-guard-expired-prompt" className="rounded-md border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-6 max-w-md space-y-4">
      <div>
        <h2 className="text-base font-semibold">Session Expired</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your admin session has expired. Sign the message again to continue —
          no gas required.
        </p>
      </div>

      {error && (
        <p id="admin-guard-expired-error" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        id="admin-guard-reauth-btn"
        onClick={signIn}
        disabled={isSigningIn}
        className="w-full sm:w-auto"
      >
        {isSigningIn ? (
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Signing…
          </span>
        ) : (
          'Re-authenticate'
        )}
      </Button>
    </div>
  )
}

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { address } = useAccount()
  const { sessionStatus, authSession } = useSiweAuth()

  const { data: session, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.session.byAddress(address ?? ''),
    queryFn: () => getApi(address, authSession?.token).getSession(),
    enabled: !!address && sessionStatus === 'authenticated',
    retry: 1
  })

  if (sessionStatus === 'disconnected') {
    return <AccessDenied reason="Admin area requires wallet connection." />
  }

  if (sessionStatus === 'expired') {
    return <ExpiredSessionPrompt />
  }

  if (sessionStatus === 'connected' || sessionStatus === 'authenticating') {
    return <SiwePrompt />
  }

  // sessionStatus === 'authenticated' from here

  if (isLoading) {
    return <LoadingState message="Checking admin access…" />
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not verify admin access"
        message={safeErrorMessage(error)}
        onRetry={() => refetch()}
      />
    )
  }

  if (!session?.roles?.includes('admin')) {
    return <AccessDenied reason="Admin privileges are required to view this page." />
  }

  return <>{children}</>
}
export { AdminGuard }
