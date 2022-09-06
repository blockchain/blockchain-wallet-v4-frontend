// State

export type ReferralState = {
  referralInformation: ReferralInformationType | undefined
}

export type ReferralInformationType = {
  announcement: {
    message: string
    style: {
      background: {
        media: {
          url: string
        }
      }
    }
    title: string
  }
  campaignId: string
  code: string
  criteria: Array<string>
  promotion: {
    icon: {
      url: string
    }
    message: string
    title: string
  }
  rewardSubtitle: string
  rewardTitle: string
}
