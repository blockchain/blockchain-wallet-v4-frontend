import { AxiosError } from 'axios'

import { NabuAddressType, NabuApiErrorType, RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { CampaignsType } from 'data/types'

import * as AT from './actionTypes'

// Types

export type CampaignState = 'NONE' | 'STARTED' | 'ENDED'

export type CampaignAttributeType = {
  'x-campaign-address': string
  'x-campaign-code'?: string
  'x-campaign-email'?: string
}

export type CampaignInfoType = {
  attributes: CampaignAttributeType
  campaignEndDate: string
  campaignName: CampaignsType
  campaignState: CampaignState
  updatedAt: string
  userCampaignState?: UserCampaignState
  userCampaignTransactionResponseList: Array<UserCampaignTransactionResponseType>
}

export type KycStateType = 'NONE' | 'PENDING' | 'UNDER_REVIEW' | 'REJECTED' | 'VERIFIED' | 'EXPIRED'

export type LimitType = {
  annual: string
  currency: string
  daily: string
  type: 'CRYPTO' | 'FIAT'
}

export type LinkFromExchangeAccountFailureType =
  | 'Invalid link id'
  | 'Link is not valid'
  | 'Failed to find the user'
  | 'User is already linked'
  | 'Wallet user is already linked with another account'

export type TagsType = {
  [key in CampaignsType]?: CampaignAttributeType
}

export type TierStateType =
  | 'none'
  | 'pending'
  | 'under_review'
  | 'rejected'
  | 'verified'
  | 'expired'

export type UserCampaignTransactionResponseType = {
  fiatCurrency: string
  fiatValue: number
  userCampaignTransactionState: string
  withdrawalAt: string
  withdrawalCurrency: string
  withdrawalQuantity: number
}

export type UserActivationStateType = 'NONE' | 'CREATED' | 'ACTIVE' | 'BLOCKED'

export type UserCampaignState =
  | 'FAILED'
  | 'REWARD_RECEIVED'
  | 'TASK_FINISHED'
  | 'REWARD_SENT'
  | 'REGISTERED'
  | 'NONE'

export type UserCampaignsType = {
  userCampaignsInfoResponseList: Array<CampaignInfoType>
}

export type Tiers = {
  current: 0 | 1 | 2 | 3
  next: 0 | 1 | 2 | 3
  selected: 0 | 1 | 2 | 3
}

export type UserDataType = {
  address?: NabuAddressType
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
  tags: TagsType
  tiers: Tiers
  userName?: string
  walletAddresses: {}
  walletGuid: string
}

export type UserTierType = {
  index: 0 | 1 | 2
  limits: {
    annual: string
    currency: string
    daily: string
    type: 'CRYPTO' | 'FIAT'
  }
  name: 'Tier 0' | 'Tier 1' | 'Tier 2'
  state: TierStateType
}

export type UserTiersType = Array<UserTierType>

// State
export interface ProfileState {
  apiToken: RemoteDataType<string, string>
  campaign: {}
  exchangeOnboarding: {
    linkFromExchangeAccountStatus: RemoteDataType<
      AxiosError<LinkFromExchangeAccountFailureType>,
      string
    >
    linkToExchangeAccountDeeplink: string | null
    linkToExchangeAccountStatus: RemoteDataType<string, string>
    shareWalletAddressesWithExchange: RemoteDataType<string, string>
  }
  userCampaigns: RemoteDataType<NabuApiErrorType, UserCampaignsType>
  userData: RemoteDataType<NabuApiErrorType, UserDataType>
  userTiers: RemoteDataType<string, UserTiersType>
}

// Actions
// Keep these sorted alphabetically
interface FetchTiersFailureAction {
  // FIXME: TypeScript error: Error?
  payload: {
    error: string
  }
  type: typeof AT.FETCH_TIERS_FAILURE
}
interface FetchTiersAction {
  type: typeof AT.FETCH_TIERS
}
interface FetchTiersLoadingAction {
  type: typeof AT.FETCH_TIERS_LOADING
}
interface FetchTiersSuccessAction {
  payload: {
    userTiers: UserTiersType
  }
  type: typeof AT.FETCH_TIERS_SUCCESS
}
interface FetchUser {
  type: typeof AT.FETCH_USER
}
interface FetchUserCampaignsFailureAction {
  // FIXME: TypeScript error: Error?
  payload: {
    error: NabuApiErrorType
  }
  type: typeof AT.FETCH_USER_CAMPAIGNS_FAILURE
}
interface FetchUserCampaignsLoadingAction {
  type: typeof AT.FETCH_USER_CAMPAIGNS_LOADING
}
interface FetchUserCampaignsSuccessAction {
  payload: {
    userCampaigns: UserCampaignsType
  }
  type: typeof AT.FETCH_USER_CAMPAIGNS_SUCCESS
}
interface FetchUserDataFailureAction {
  payload: {
    error: NabuApiErrorType
  }
  type: typeof AT.FETCH_USER_DATA_FAILURE
}
interface FetchUserDataLoadingAction {
  type: typeof AT.FETCH_USER_DATA_LOADING
}
interface FetchUserDataSuccessAction {
  payload: {
    userData: UserDataType
  }
  type: typeof AT.FETCH_USER_DATA_SUCCESS
}
interface LinkFromExchangeAccountAction {
  payload: {
    address?: NabuAddressType
    email?: string
    linkId: string
  }
  type: typeof AT.LINK_FROM_EXCHANGE_ACCOUNT
}
interface LinkFromExchangeAccountFailureAction {
  // FIXME: TypeScript error: Error?
  payload: {
    error: AxiosError<LinkFromExchangeAccountFailureType>
  }
  type: typeof AT.LINK_FROM_EXCHANGE_ACCOUNT_FAILURE
}
interface LinkFromExchangeAccountLoadingAction {
  type: typeof AT.LINK_FROM_EXCHANGE_ACCOUNT_LOADING
}
interface LinkFromExchangeAccountSuccessAction {
  payload: {
    data: 'User is successfully linked'
  }
  type: typeof AT.LINK_FROM_EXCHANGE_ACCOUNT_SUCCESS
}
interface LinkToExchangeAccountAction {
  payload: {
    utmCampaign: string
  }
  type: typeof AT.LINK_TO_EXCHANGE_ACCOUNT
}
interface LinkToExchangeAccountFailureAction {
  // FIXME: TypeScript error: Error?
  payload: {
    error: string
  }
  type: typeof AT.LINK_TO_EXCHANGE_ACCOUNT_FAILURE
}
interface LinkToExchangeAccountLoadingAction {
  type: typeof AT.LINK_TO_EXCHANGE_ACCOUNT_LOADING
}
interface LinkToExchangeAccountResetAction {
  type: typeof AT.LINK_TO_EXCHANGE_ACCOUNT_RESET
}
interface LinkToExchangeAccountSuccessAction {
  type: typeof AT.LINK_TO_EXCHANGE_ACCOUNT_SUCCESS
}
interface SetApiTokenFailureAction {
  // FIXME: TypeScript error: Error?
  payload: {
    error: string
  }
  type: typeof AT.SET_API_TOKEN_FAILURE
}
interface SetApiTokenNotAskedAction {
  type: typeof AT.SET_API_TOKEN_NOT_ASKED
}
interface SetApiTokenLoadingAction {
  type: typeof AT.SET_API_TOKEN_LOADING
}
interface SetApiTokenSuccessAction {
  payload: {
    token: string
  }
  type: typeof AT.SET_API_TOKEN_SUCCESS
}
interface SetCampaignAction {
  payload: {
    campaign: CampaignsType
  }
  type: typeof AT.SET_CAMPAIGN
}
interface SetLinkToExchangeAccountDeeplinkAction {
  payload: {
    deeplink: string
  }
  type: typeof AT.SET_LINK_TO_EXCHANGE_ACCOUNT_DEEPLINK
}
interface ShareWalletAddressesWithExchange {
  type: typeof AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE
}
interface ShareWalletAddressWithExchangeFailureAction {
  // FIXME: TypeScript e: Error?
  payload: {
    error: string
  }
  type: typeof AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_FAILURE
}
interface ShareWalletAddressWithExchangeLoadingAction {
  type: typeof AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_LOADING
}
interface ShareWalletAddressWithExchangeSuccessAction {
  // FIXME: TypeScript data
  payload: {
    data: any
  }
  type: typeof AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_SUCCESS
}

export type ProfileActionTypes =
  | FetchTiersFailureAction
  | FetchTiersLoadingAction
  | FetchTiersSuccessAction
  | FetchTiersAction
  | FetchUser
  | FetchUserCampaignsFailureAction
  | FetchUserCampaignsLoadingAction
  | FetchUserCampaignsSuccessAction
  | FetchUserDataFailureAction
  | FetchUserDataLoadingAction
  | FetchUserDataSuccessAction
  | LinkFromExchangeAccountAction
  | LinkFromExchangeAccountFailureAction
  | LinkFromExchangeAccountLoadingAction
  | LinkFromExchangeAccountSuccessAction
  | LinkToExchangeAccountAction
  | LinkToExchangeAccountFailureAction
  | LinkToExchangeAccountResetAction
  | LinkToExchangeAccountLoadingAction
  | LinkToExchangeAccountSuccessAction
  | SetApiTokenFailureAction
  | SetApiTokenNotAskedAction
  | SetApiTokenLoadingAction
  | SetApiTokenSuccessAction
  | SetCampaignAction
  | SetLinkToExchangeAccountDeeplinkAction
  | ShareWalletAddressesWithExchange
  | ShareWalletAddressWithExchangeFailureAction
  | ShareWalletAddressWithExchangeLoadingAction
  | ShareWalletAddressWithExchangeSuccessAction
