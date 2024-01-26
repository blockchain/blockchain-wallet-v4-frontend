import { AxiosError } from 'axios'

import { SofiMigrationStatusResponseType } from '@core/network/api/sofi/types'
import type {
  NabuAddressType,
  NabuApiErrorType,
  RemoteDataType,
  UserRiskSettings,
  WalletFiatType
} from '@core/types'
import type { CampaignsType } from 'data/components/identityVerification/types'

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

export enum ExchangeAuthOriginType {
  Login = 'login',
  SideMenu = 'sideMenu',
  Signup = 'signup'
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

export type UserTradingCurrencies = {
  defaultWalletCurrency: WalletFiatType
  preferredFiatTradingCurrency: WalletFiatType
  usableFiatCurrencies: WalletFiatType[]
  userFiatCurrencies: WalletFiatType[]
}

type UserLegalEntities = 'BC_BVI_2' | 'BC_INT' | 'BC_LT' | 'BC_LT_2' | 'BC_NG' | 'BC_US'

export type UserDataType = {
  address?: NabuAddressType
  currencies: UserTradingCurrencies
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
  userLegalEntity: UserLegalEntities
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

export enum SofiUserMigrationStatus {
  AWAITING_USER = 'AWAITING_USER',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS'
}

export type SofiLinkData = {
  aesCiphertext: string
  aesIv: string
  aesKeyCiphertext: string
  aesTag: string
}

export type SofiMigrationErrorType = {
  id: SofiMigrationErrorIds
  message: string
  title: string
}

export enum SofiMigrationErrorIds {
  ALREADY_MIGRTED = 'sofi.migration.error.account.migrated',
  NON_US = 'sofi.migration.error.account.not.us',
  NOT_ELIGIBLE = 'sofi.migration.error.account.not.eligible',
  RATE_LIMIT = 'sofi.migration.error.rate.limit',
  SSN_ERROR = 'sofi.migration.error.ssn.verification.failed'
}
type Balance = {
  amount: string
  currency: string // using string to handle large numbers and precision
}

export type SofiMigratedBalances = {
  balances: Balance[]
}

export type ErrorType = {
  code: number
  description: string
  id: string
  status: number
  type: string
}
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
  sofiAssociateNabuUser: RemoteDataType<boolean, string>
  sofiData: RemoteDataType<ErrorType, SofiMigrationStatusResponseType>
  sofiLinkData: SofiLinkData | {}
  sofiMigrationStatus: RemoteDataType<SofiMigrationErrorType, any>
  sofiMigrationStatusFromPolling: RemoteDataType<string, SofiUserMigrationStatus>
  sofiMigrationTransferedBalances: RemoteDataType<string, SofiMigratedBalances>
  sofiUserMigrationStatus: SofiUserMigrationStatus | null
  userCampaigns: RemoteDataType<NabuApiErrorType, UserCampaignsType>
  userData: RemoteDataType<NabuApiErrorType, UserDataType>
  userRiskSettings: RemoteDataType<NabuApiErrorType, UserRiskSettings>
  userTiers: RemoteDataType<string, UserTiersType>
}

// Actions
// Keep these sorted alphabetically

interface ClearProfileStateAction {
  type: typeof AT.CLEAR_PROFILE_STATE
}
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

interface AuthAndRouteToExchangeAction {
  payload: {
    origin: ExchangeAuthOriginType
  }
  type: typeof AT.AUTH_AND_ROUTE_TO_EXCHANGE
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

interface SigninActionType {
  payload?: {
    firstLogin?: boolean
  }
  type: typeof AT.SIGN_IN
}

interface FetchUserRiskSettingsFailureAction {
  payload: {
    error: NabuApiErrorType
  }
  type: typeof AT.FETCH_USER_RISK_SETTINGS_FAILURE
}
interface FetchUserRiskSettingsLoadingAction {
  type: typeof AT.FETCH_USER_RISK_SETTINGS_LOADING
}
interface FetchUserRiskSettingsSuccessAction {
  payload: {
    userRiskSettings: UserRiskSettings
  }
  type: typeof AT.FETCH_USER_RISK_SETTINGS_SUCCESS
}
interface FetchSofiMigrationStatusLoadingAction {
  type: typeof AT.FETCH_SOFI_MIGRATION_STATUS_LOADING
}
interface FetchSofiMigrationStatusSuccessAction {
  payload: SofiMigrationStatusResponseType
  type: typeof AT.FETCH_SOFI_MIGRATION_STATUS_SUCCESS
}
interface FetchSofiMigrationStatusFailureAction {
  payload: {
    error: ErrorType
  }
  type: typeof AT.FETCH_SOFI_MIGRATION_STATUS_FAILURE
}

interface MigrateSofiUserLoadingAction {
  type: typeof AT.MIGRATE_SOFI_USER_LOADING
}

interface MigrateSofiUserSuccessAction {
  payload: {
    data
  }
  type: typeof AT.MIGRATE_SOFI_USER_SUCCESS
}

interface MigrateSofiUserFailureAction {
  payload: {
    error: SofiMigrationErrorType
  }
  type: typeof AT.MIGRATE_SOFI_USER_FAILURE
}

interface SetSofiLinkDataAction {
  payload: {
    linkData: SofiLinkData
  }
  type: typeof AT.SET_SOFI_LINK_DATA
}

interface AssociateSofiUserSignupAction {
  type: typeof AT.ASSOCIATE_SOFI_USER_SIGNUP
}

interface AssociateSofiUserLoginAction {
  type: typeof AT.ASSOCIATE_SOFI_USER_LOGIN
}

interface AssociateSofiUserLoadingAction {
  type: typeof AT.ASSOCIATE_SOFI_USER_LOADING
}

interface AssociateSofiUserSuccessAction {
  payload: { boolean }
  type: typeof AT.ASSOCIATE_SOFI_USER_SUCCESS
}

interface AssociateSofiUserFailureAction {
  payload: { error }
  type: typeof AT.ASSOCIATE_SOFI_USER_FAILURE
}

interface SetSofiUserStatusFromPollingAction {
  payload: { sofiUserStatus: SofiUserMigrationStatus }
  type: typeof AT.SET_SOFI_USER_STATUS_FROM_POLLING
}

interface SetSofiMigratedBalancesAction {
  payload: { balances: SofiMigratedBalances }
  type: typeof AT.SET_SOFI_MIGRATED_BALANCES
}

interface SetSofiUserStatusAction {
  payload: { sofiUserStatus: SofiUserMigrationStatus }
  type: typeof AT.SET_SOFI_USER_STATUS
}

export type ProfileActionTypes =
  | AssociateSofiUserSignupAction
  | AssociateSofiUserLoginAction
  | AssociateSofiUserLoadingAction
  | AssociateSofiUserSuccessAction
  | AssociateSofiUserFailureAction
  | AuthAndRouteToExchangeAction
  | ClearProfileStateAction
  | FetchTiersFailureAction
  | FetchTiersLoadingAction
  | FetchTiersSuccessAction
  | FetchTiersAction
  | FetchSofiMigrationStatusFailureAction
  | FetchSofiMigrationStatusLoadingAction
  | FetchSofiMigrationStatusSuccessAction
  | FetchUser
  | FetchUserCampaignsFailureAction
  | FetchUserCampaignsLoadingAction
  | FetchUserCampaignsSuccessAction
  | FetchUserDataFailureAction
  | FetchUserDataLoadingAction
  | FetchUserDataSuccessAction
  | FetchUserRiskSettingsSuccessAction
  | FetchUserRiskSettingsLoadingAction
  | FetchUserRiskSettingsFailureAction
  | LinkFromExchangeAccountAction
  | LinkFromExchangeAccountFailureAction
  | LinkFromExchangeAccountLoadingAction
  | LinkFromExchangeAccountSuccessAction
  | LinkToExchangeAccountAction
  | LinkToExchangeAccountFailureAction
  | LinkToExchangeAccountResetAction
  | LinkToExchangeAccountLoadingAction
  | LinkToExchangeAccountSuccessAction
  | MigrateSofiUserLoadingAction
  | MigrateSofiUserSuccessAction
  | MigrateSofiUserFailureAction
  | SetApiTokenFailureAction
  | SetApiTokenNotAskedAction
  | SetApiTokenLoadingAction
  | SetApiTokenSuccessAction
  | SetCampaignAction
  | SetLinkToExchangeAccountDeeplinkAction
  | SetSofiLinkDataAction
  | SetSofiMigratedBalancesAction
  | SetSofiUserStatusAction
  | SetSofiUserStatusFromPollingAction
  | ShareWalletAddressesWithExchange
  | ShareWalletAddressWithExchangeFailureAction
  | ShareWalletAddressWithExchangeLoadingAction
  | ShareWalletAddressWithExchangeSuccessAction
  | SigninActionType
