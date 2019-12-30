export type Campaigns = 'BLOCKSTACK'

export type UserCampaignState =
  | 'FAILED'
  | 'REWARD_RECEIVED'
  | 'TASK_FINISHED'
  | 'REWARD_SEND'
  | 'REGISTERED'
  | 'NONE'

export interface CampaignType {
  attributes: {
    'x-campaign-reject-reason': string
  }
  campaignName: Campaigns
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
