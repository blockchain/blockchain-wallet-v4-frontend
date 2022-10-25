import {
  AccountTypes,
  CoinType,
  EarnAccountBalanceResponseType,
  EarnAccountResponseType,
  EarnAfterTransactionType,
  EarnDepositLimits,
  EarnEDDStatus,
  EarnEligibleType,
  FiatType,
  InterestLimitsType,
  PaymentValue,
  RatesType,
  RemoteDataType,
  RewardsRatesType,
  StakingLimitsType,
  StakingRatesType,
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

export type EarnStepMetaData = {
  depositSuccess?: boolean
  error?: string
  withdrawSuccess?: boolean
  withdrawalAmount?: number
}

export type EarnDepositFormType = 'rewardsDepositForm' | 'stakingDepositForm'

export type InterestStep = keyof typeof InterestSteps

export type StakingStep = keyof typeof StakingSteps

export enum StakingStepsType {
  'WARNING',
  'DEPOSIT',
  'DEPOSIT_SUCCESS',
  'ACCOUNT_SUMMARY'
}

export type InterestTransactionsReportType = Array<Array<string>>

export type InterestHistoryCoinFormType = { coin: CoinType | 'ALL' }

export type ErrorStringType = { error: string }

export type InterestLimits = { coin: CoinType; currency: FiatType }

export type EarnInstrumentsType = Array<{
  coin: CoinType
  product: 'Staking' | 'Rewards'
  rate: RatesType
}>

export type TransferMinMaxAmountType = {
  amount: number
  formName: EarnDepositFormType
}

export type EarnTransactionType = TransactionType & {
  product: 'Staking' | 'Rewards'
}

export type PendingTransactionType = {
  amount: string
  bondingDays?: number
  date: string
  type: 'BONDING' | 'TRANSACTIONS'
}

//
// State
//
export interface InterestState {
  afterTransaction: RemoteDataType<string, EarnAfterTransactionType>
  coin: CoinType
  earnDepositLimits: EarnMinMaxType
  earnEDDStatus: RemoteDataType<string, EarnEDDStatus>
  earnEDDWithdrawLimits: RemoteDataType<string, WithdrawLimits>
  instruments: RemoteDataType<string, EarnInstrumentsType>
  interestEligible: RemoteDataType<string, EarnEligibleType>
  interestLimits: RemoteDataType<string, InterestLimitsType>
  interestRates: RemoteDataType<string, RewardsRatesType['rates']>
  isAmountDisplayedInCrypto: boolean
  // make this optional here. places where ts doesnt like it, check, custodial
  payment?: RemoteDataType<string, PaymentValue | undefined>
  pendingStakingTransactions: RemoteDataType<string, Array<PendingTransactionType>>
  rewardsAccount: RemoteDataType<string, EarnAccountResponseType>
  rewardsAccountBalance: RemoteDataType<string, EarnAccountBalanceResponseType>
  rewardsEDDDepositLimits: RemoteDataType<string, EarnDepositLimits>
  rewardsStep: {
    data: EarnStepMetaData
    name: InterestStep
  }
  rewardsTransactionsNextPage?: string | null
  stakingAccount: RemoteDataType<string, EarnAccountResponseType>
  stakingAccountBalance: RemoteDataType<string, EarnAccountBalanceResponseType>
  stakingEligible: RemoteDataType<string, EarnEligibleType>
  stakingLimits: RemoteDataType<string, StakingLimitsType>
  stakingRates: RemoteDataType<string, StakingRatesType['rates']>
  stakingStep: {
    data: EarnStepMetaData
    name: StakingStep
  }
  stakingTransactionsNextPage?: string | null
  totalBondingDeposits: number
  transactions: Array<EarnTransactionType>
  transactionsReport: RemoteDataType<string, Array<EarnTransactionType>>
  underSanctionsMessage: string | null
  withdrawalMinimums: RemoteDataType<string, WithdrawalMinimumType>
}
