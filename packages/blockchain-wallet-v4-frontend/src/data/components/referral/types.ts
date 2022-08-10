// State

export type ReferralState = {
  referralInformation: ReferralInformationType | undefined
}

export type ReferralInformationType = {
  campaignId: string
  code: string
  criteria: Array<string>
  rewardSubtitle: string
  rewardTitle: string
}
