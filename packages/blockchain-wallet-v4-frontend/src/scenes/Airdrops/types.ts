export type Campaigns = 'BLOCKSTACK' | 'SUNRIVER' | 'POWER_PAX'

export type UserCampaignState =
  | 'FAILED'
  | 'REWARD_RECEIVED'
  | 'TASK_FINISHED'
  | 'REWARD_SEND'
  | 'REGISTERED'
  | 'NONE'

export type CampaignState = 'NONE' | 'STARTED' | 'ENDED'

export interface CampaignType {
  attributes: {
    'x-campaign-reject-reason': string
  }
  campaignName: Campaigns
  campaignState: CampaignState
  userCampaignState: UserCampaignState
}

// Move this somewhere more generic
export type KycStatesType =
  | 'NONE'
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'REJECTED'
  | 'VERIFIED'
  | 'EXPIRED'
