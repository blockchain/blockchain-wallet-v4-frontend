import {
  AccountTypes,
  CoinType,
  EarnAccountBalanceResponseType,
  EarnAccountResponseType,
  EarnDepositLimits,
  EarnEligibleType,
  FiatType,
  InterestAfterTransactionType,
  InterestEDDStatus,
  InterestLimitsType,
  InterestTransactionType,
  PaymentValue,
  RemoteDataType,
  RewardsRatesType,
  StakingLimitsType,
  StakingRatesType,
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

export type InterestTransactionsReportType = Array<Array<string>>

export type InterestHistoryCoinFormType = { coin: CoinType | 'ALL' }

export type ErrorStringType = { error: string }

export type InterestLimits = { coin: CoinType; currency: FiatType }

export type EarnInstrumentsType = Array<{ coin: CoinType; product: 'Staking' | 'Rewards' }>

export type TransferMinMaxAmountType = {
  amount: number
  formName: EarnDepositFormType
}

//
// State
//
export interface InterestState {
  afterTransaction: RemoteDataType<string, InterestAfterTransactionType>
  coin: CoinType
  earnDepositLimits: EarnMinMaxType
  instruments: RemoteDataType<string, EarnInstrumentsType>
  interestEDDDepositLimits: RemoteDataType<string, EarnDepositLimits>
  interestEDDStatus: RemoteDataType<string, InterestEDDStatus>
  interestEDDWithdrawLimits: RemoteDataType<string, WithdrawLimits>
  interestEligible: RemoteDataType<string, EarnEligibleType>
  interestLimits: RemoteDataType<string, InterestLimitsType>
  interestRates: RemoteDataType<string, RewardsRatesType['rates']>
  isAmountDisplayedInCrypto: boolean
  // make this optional here. places where ts doesnt like it, check, custodial
  payment?: RemoteDataType<string, PaymentValue | undefined>
  rewardsAccount: RemoteDataType<string, EarnAccountResponseType>
  rewardsAccountBalance: RemoteDataType<string, EarnAccountBalanceResponseType>
  rewardsStep: {
    data: EarnStepMetaData
    name: InterestStep
  }
  stakingAccount: RemoteDataType<string, EarnAccountResponseType>
  stakingAccountBalance: RemoteDataType<string, EarnAccountBalanceResponseType>
  stakingEligible: RemoteDataType<string, EarnEligibleType>
  stakingLimits: RemoteDataType<string, StakingLimitsType>
  stakingRates: RemoteDataType<string, StakingRatesType['rates']>
  stakingStep: {
    data: EarnStepMetaData
    name: StakingStep
  }
  transactions: Array<InterestTransactionType>
  transactionsNextPage: string | null
  transactionsReport: RemoteDataType<string, Array<InterestTransactionType>>
  underSanctionsMessage: string | null
  withdrawalMinimums: RemoteDataType<string, WithdrawalMinimumType>
}
