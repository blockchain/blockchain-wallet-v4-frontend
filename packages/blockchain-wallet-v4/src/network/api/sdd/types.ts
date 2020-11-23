export type SDDType = {
  eligible: boolean
  ineligibilityReason: 'KYC_TIER' | 'BLOCKED' | 'REGION'
  tier: 0 | 1 | 2 | 3 | 4
}

export type SDDUpdateType = {
  verified: boolean
}
