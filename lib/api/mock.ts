import { AccessApi, AccessPolicy, Community, MemberProfile, MemberRow, Membership, Resource, Role, Session } from './types'

const community: Community = {
  id: 'guildpass-demo',
  name: 'GuildPass Demo Community',
  description: 'Demo space for membership and gating',
  tiers: ['free', 'standard', 'pro']
}

let resources: Resource[] = [
  { id: 'alpha', title: 'Alpha Docs', description: 'Internal docs', minTier: 'standard' },
  { id: 'pro-reports', title: 'Pro Reports', description: 'Advanced insight', minTier: 'pro' },
  { id: 'mem-updates', title: 'Member Updates', description: 'Community updates', minTier: 'free' }
]

let policies: AccessPolicy[] = [
  { resourceId: 'alpha', minTier: 'standard' },
  { resourceId: 'pro-reports', minTier: 'pro' },
  { resourceId: 'mem-updates', minTier: 'free' }
]

const memberStore: Record<string, { membership: Membership; roles: Role[]; profile: MemberProfile }> = {}

function ensureAddress(addr?: string) {
  if (!addr) return null
  if (!memberStore[addr]) {
    memberStore[addr] = {
      membership: {
        address: addr,
        tier: 'free',
        active: true
      },
      roles: ['member'],
      profile: {
        address: addr,
        displayName: `User ${addr.slice(0, 6)}`,
        badges: []
      }
    }
  }
  return memberStore[addr]
}

export class MockAccessApi implements AccessApi {
  constructor(private readonly address?: string) {}

  async getSession(): Promise<Session> {
    const data = ensureAddress(this.address)
    return {
      address: this.address,
      roles: data ? data.roles : [],
      membership: data ? data.membership : undefined,
      community
    }
  }

  async getCommunity(): Promise<Community> {
    return community
  }

  async getMembership(address: string): Promise<Membership | null> {
    const data = ensureAddress(address)
    return data?.membership ?? null
  }

  async getProfile(address: string): Promise<MemberProfile | null> {
    const data = ensureAddress(address)
    return data?.profile ?? null
  }

  async listMembers(): Promise<MemberRow[]> {
    return Object.values(memberStore).map((m) => ({
      address: m.membership.address,
      roles: m.roles,
      tier: m.membership.tier,
      active: m.membership.active
    }))
  }

  async listResources(): Promise<Resource[]> {
    return resources
  }

  async listPolicies(): Promise<AccessPolicy[]> {
    return policies
  }

  async assignRole(address: string, role: Role): Promise<void> {
    const data = ensureAddress(address)
    if (!data) return
    if (!data.roles.includes(role)) data.roles.push(role)
  }

  async updatePolicy(policy: AccessPolicy): Promise<void> {
    const idx = policies.findIndex((p) => p.resourceId === policy.resourceId)
    if (idx >= 0) policies[idx] = policy
    else policies.push(policy)
  }
}
