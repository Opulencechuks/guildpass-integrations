export type Role = 'member' | 'moderator' | 'admin'

export type MembershipTier = 'free' | 'standard' | 'pro'

export interface Community {
  id: string
  name: string
  description?: string
  tiers: MembershipTier[]
}

export interface Membership {
  address: string
  tier: MembershipTier
  active: boolean
  expiresAt?: string
}

export interface MemberProfile {
  address: string
  displayName?: string
  bio?: string
  badges: string[]
}

export interface Session {
  address?: string
  roles: Role[]
  membership?: Membership
  community?: Community
}

export interface Resource {
  id: string
  title: string
  description?: string
  minTier?: MembershipTier
  roles?: Role[]
}

export interface AccessPolicy {
  resourceId: string
  minTier?: MembershipTier
  roles?: Role[]
}

export interface MemberRow {
  address: string
  roles: Role[]
  tier: MembershipTier
  active: boolean
}

export interface AccessApi {
  getSession(): Promise<Session>
  getCommunity(): Promise<Community>
  getMembership(address: string): Promise<Membership | null>
  getProfile(address: string): Promise<MemberProfile | null>
  listMembers(): Promise<MemberRow[]>
  listResources(): Promise<Resource[]>
  listPolicies(): Promise<AccessPolicy[]>
  assignRole(address: string, role: Role): Promise<void>
  updatePolicy(policy: AccessPolicy): Promise<void>
}
