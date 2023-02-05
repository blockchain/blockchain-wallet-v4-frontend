import {
  AccountTypes,
  BSBalancesType,
  CoinType,
  EarnAccountBalanceResponseType,
  EarnAccountResponseType,
  EarnAfterTransactionType,
  EarnDepositLimits,
  EarnEDDStatus,
  EarnEligibleType,
  EarnLimitsType,
  EarnRatesType,
  FiatType,
  InterestLimitsType,
  NabuCustodialProductType,
  PaymentValue,
  RatesType,
  RemoteDataType,
  RewardsRatesType,
  TransactionType,
  WithdrawalMinimumType,
  WithdrawLimits
} from '@core/types'

//
// Types
//
export type RewardsDepositFormType = {
  agreement: boolean
  depositAmount: number
  earnDepositAccount: AccountTypes
  loanTimeFrame: 'long' | 'short'
  terms: boolean
}

export type StakingDepositFormType = {
  agreement: boolean
  depositAmount: number
  earnDepositAccount: AccountTypes
  terms: boolean
}

export type ActiveRewardsDepositFormType = {
  agreement1: boolean
  agreement2: boolean
  depositAmount: string
  earnDepositAccount: AccountTypes
  terms: boolean
}

export type EarnMinMaxType = {
  maxCoin: number
  maxFiat: number
  minCoin: number
  minFiat: number
}
export type InterestWithdrawalFormType = {
  earnWithdrawalAccount: AccountTypes
  withdrawalAmount: number
}

export enum InterestSteps {
  'ACCOUNT_SUMMARY',
  'DEPOSIT',
  'DEPOSIT_SUCCESS',
  'WITHDRAWAL'
}

export enum StakingSteps {
  'ACCOUNT_SUMMARY',
  'DEPOSIT',
  'DEPOSIT_SUCCESS',
  'WARNING'
}

export enum ActiveRewardsSteps {
  'ACCOUNT_SUMMARY',
  'DEPOSIT',
  'DEPOSIT_SUCCESS',
  'WARNING',
  'WITHDRAWAL',
  'WITHDRAWAL_REQUESTED'
}

export type EarnStepMetaData = {
  depositSuccess?: boolean
  error?: string
  withdrawSuccess?: boolean
  withdrawalAmount?: number
}

export type EarnDepositFormType =
  | 'passiveRewardsDepositForm'
  | 'stakingDepositForm'
  | 'activeRewardsDepositForm'

export type InterestStep = keyof typeof InterestSteps

export type StakingStep = keyof typeof StakingSteps

export type ActiveRewardsStep = keyof typeof ActiveRewardsSteps

export enum StakingStepsType {
  'WARNING',
  'DEPOSIT',
  'DEPOSIT_SUCCESS',
  'ACCOUNT_SUMMARY'
}

export type InterestTransactionsReportType = Array<Array<string>>

export type EarnHistoryCoinFormType = { coin: CoinType | 'ALL' }

export type ErrorStringType = { error: string }

export type InterestLimits = { coin: CoinType; currency: FiatType }

export type EarnProductsType = 'Staking' | 'Passive' | 'Active'

export type EarnTabsType = 'All' | EarnProductsType | string

export type CreateLimitsParamTypes = {
  custodialBalances?: BSBalancesType
  payment?: PaymentValue
  product: EarnProductsType
}

export type EarnInstrumentsType = Array<{
  coin: CoinType
  product: EarnProductsType
  rate: RatesType
}>

export type TransferMinMaxAmountType = {
  amount: number
  formName: EarnDepositFormType
}

export type EarnTransactionType = TransactionType & {
  product: EarnProductsType
}

export type PendingTransactionType = {
  amount: string
  bondingDays?: number
  date: string
  type: 'BONDING' | 'TRANSACTIONS'
}

export type EarnInitializeWithdrawalType = {
  coin: CoinType
  formName: 'passiveRewardsWithdrawalForm' | 'activeRewardsWithdrawalForm'
  hidePkWallets?: boolean
  walletCurrency: FiatType
}

export type EarnWithdrawalType = {
  coin: CoinType
  destination: NabuCustodialProductType
  formName: 'passiveRewardsWithdrawalForm' | 'activeRewardsWithdrawalForm'
  origin: NabuCustodialProductType
  withdrawalAmountCrypto: number
  withdrawalAmountFiat: number
}

export type ActiveRewardsWithdrawalType = {
  coin: CoinType
  withdrawalAmountCrypto: string
}

//
// State
//
export interface InterestState {
  activeRewardsAccount: RemoteDataType<string, EarnAccountResponseType>
  activeRewardsAccountBalance: RemoteDataType<string, EarnAccountBalanceResponseType>
  activeRewardsEligible: RemoteDataType<string, EarnEligibleType>
  activeRewardsLimits: RemoteDataType<string, EarnLimitsType>
  activeRewardsRates: RemoteDataType<string, EarnRatesType['rates']>
  activeRewardsStep: {
    data: EarnStepMetaData
    name: ActiveRewardsStep
  }
  activeRewardsTransactionsNextPage?: string | null
  afterTransaction: RemoteDataType<string, EarnAfterTransactionType>
  coin: CoinType
  earnDepositLimits: EarnMinMaxType
  earnEDDStatus: RemoteDataType<string, EarnEDDStatus>
  earnEDDWithdrawLimits: RemoteDataType<string, WithdrawLimits>
  earnTab: EarnTabsType
  instruments: RemoteDataType<string, EarnInstrumentsType>
  interestEligible: RemoteDataType<string, EarnEligibleType>
  interestLimits: RemoteDataType<string, InterestLimitsType>
  interestRates: RemoteDataType<string, RewardsRatesType['rates']>
  isAmountDisplayedInCrypto: boolean
  passiveRewardsAccountBalance: RemoteDataType<string, EarnAccountBalanceResponseType>
  // make this optional here. places where ts doesnt like it, check, custodial
  payment?: RemoteDataType<string, PaymentValue | undefined>
  pendingActiveRewardsTransactions: RemoteDataType<string, Array<PendingTransactionType>>
  pendingStakingTransactions: RemoteDataType<string, Array<PendingTransactionType>>
  rewardsAccount: RemoteDataType<string, EarnAccountResponseType>
  rewardsEDDDepositLimits: RemoteDataType<string, EarnDepositLimits>
  rewardsStep: {
    data: EarnStepMetaData
    name: InterestStep
  }
  rewardsTransactionsNextPage?: string | null
  searchValue: string
  showAvailableAssets: boolean
  stakingAccount: RemoteDataType<string, EarnAccountResponseType>
  stakingAccountBalance: RemoteDataType<string, EarnAccountBalanceResponseType>
  stakingEligible: RemoteDataType<string, EarnEligibleType>
  stakingLimits: RemoteDataType<string, EarnLimitsType>
  stakingRates: RemoteDataType<string, EarnRatesType['rates']>
  stakingStep: {
    data: EarnStepMetaData
    name: StakingStep
  }
  stakingTransactionsNextPage?: string | null
  totalActiveRewardsBondingDeposits: number
  totalStakingBondingDeposits: number
  transactions: Array<EarnTransactionType>
  transactionsReport: RemoteDataType<string, Array<EarnTransactionType>>
  underSanctionsMessage: string | null
  withdrawalMinimums: RemoteDataType<string, WithdrawalMinimumType>
}
