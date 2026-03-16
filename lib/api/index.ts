import { LiveAccessApi } from './live'
import { MockAccessApi } from './mock'
import { AccessApi } from './types'

export function getApi(address?: string): AccessApi {
  const mock =
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  if (mock) return new MockAccessApi(address)
  return new LiveAccessApi(address)
}

export * from './types'
