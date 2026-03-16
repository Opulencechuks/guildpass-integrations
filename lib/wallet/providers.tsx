import { PropsWithChildren, useState } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, base, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { InjectedConnector } from '@wagmi/connectors'

const wagmiConfig = createConfig({
  chains: [mainnet, base, sepolia],
  connectors: [new InjectedConnector({})],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http()
  }
})

export function RootProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
