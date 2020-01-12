import { CampaignsType } from 'data/components/types'
import { RemoteData } from 'blockchain-wallet-v4/src/remote/types'

// Types

export type AddressType = {
  city: string
  country: string
  line1: string
  line2?: string
  postCode: string
  state?: string
}

export type UserCampaignState =
  | 'FAILED'
  | 'REWARD_RECEIVED'
  | 'TASK_FINISHED'
  | 'REWARD_SEND'
  | 'REGISTERED'
  | 'NONE'

export type CampaignState = 'NONE' | 'STARTED' | 'ENDED'

export type UserActivationStateType = 'NONE' | 'CREATED' | 'ACTIVE' | 'BLOCKED'

export type KycStateType =
  | 'NONE'
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'REJECTED'
  | 'VERIFIED'
  | 'EXPIRED'

export type LimitType = {
  annual: string
  currency: string
  daily: string
  type: 'CRYPTO' | 'FIAT'
}

export type CampaignAttributeType = {
  'x-campaign-address': string
  'x-campaign-code'?: string
  'x-campaign-email'?: string
}

export type TagsType = {
  [key in CampaignsType]?: CampaignAttributeType
}

export type UserCampaignTransactionResponseType = {
  fiatCurrency: string
  fiatValue: number
  userCampaignTransactionState: string
  withdrawalAt: string
  withdrawalCurrency: string
  withdrawalQuantity: number
}

export type CampaignInfoType = {
  attributes: CampaignAttributeType
  campaignEndDate: string
  campaignName: CampaignsType
  campaignState: CampaignState
  updatedAt: string
  userCampaignState: UserCampaignState
  userCampaignTransactionResponseList: Array<
    UserCampaignTransactionResponseType
  >
}

export type UserDataType = {
  address?: AddressType
  dob: string
  email: string
  emailVerified: boolean
  firstName: string
  id: string
  kycState: KycStateType
  lastName: string
  limits: Array<LimitType>
  mobile: string
  mobileVerified: boolean
  resubmission: null
  settings: null
  state: UserActivationStateType
  tags: Array<TagsType>
  userName?: string
  walletAddresses: {}
  walletGuid: string
}

export type UserCampaignsType = {
  userCampaignsInfoResponseList: Array<CampaignInfoType>
}

// State
export interface ProfileState {
  apiToken: RemoteData<string, string>
  campaign: {}
  exchangeOnboarding: {
    linkFromExchangeAccountStatus: RemoteData<string, string>
    linkToExchangeAccountDeeplink: null
    linkToExchangeAccountStatus: RemoteData<string, string>
    shareWalletAddressesWithExchange: RemoteData<string, string>
  }
  userCampaigns: RemoteData<string, UserCampaignsType>
  userData: RemoteData<string, UserDataType>
  userTiers: RemoteData<any, any>
}

// Actions
