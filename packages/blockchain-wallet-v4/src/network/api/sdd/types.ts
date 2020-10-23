export type SDDType = {
  eligible: boolean
  ineligibilityReason: 'KYC_TIER' | 'BLOCKED' | 'REGION'
}

export type SDDUpdateType = {
  eligible: boolean
  rejectReason: 'HIGH_RISK' | 'LIMITS'
}
