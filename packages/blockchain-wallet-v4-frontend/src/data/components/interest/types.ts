import {
  AccountTypes,
  CoinType,
  EarnEligibleType,
  FiatType,
  InterestAccountBalanceType,
  InterestAccountType,
  InterestAfterTransactionType,
  InterestDepositLimits,
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
export type InterestDepositFormType = {
  agreement: boolean
  depositAmount: number
  interestDepositAccount: AccountTypes
  loanTimeFrame: 'long' | 'short'
  terms: boolean
}

export type EarnMinMaxType = {
  maxCoin: number
  maxFiat: number
  minCoin: number
  minFiat: number
}
export type InterestWithdrawalFormType = {
  interestWithdrawalAccount: AccountTypes
  withdrawalAmount: number
}

export enum InterestSteps {
  'ACCOUNT_SUMMARY',
  'DEPOSIT',
  'DEPOSIT_SUCCESS',
  'WITHDRAWAL'
}

export enum StakingSteps {
  'WARNING',
  'DEPOSIT',
  'DEPOSIT_SUCCESS'
}

export type InterestStepMetadata = {
  depositSuccess?: boolean
  error?: string
  withdrawSuccess?: boolean
  withdrawalAmount?: number
}

export type InterestStep = keyof typeof InterestSteps

export type StakingStep = keyof typeof StakingSteps

export type InterestTransactionsReportType = Array<Array<string>>

export type InterestHistoryCoinFormType = { coin: CoinType | 'ALL' }

export type ErrorStringType = { error: string }

export type InterestLimits = { coin: CoinType; currency: FiatType }

export type EarnInstrumentsType = Array<{ coin: CoinType; product: 'Staking' | 'Rewards' }>

//
// State
//
export interface InterestState {
  account: RemoteDataType<string, InterestAccountType>
  accountBalance: RemoteDataType<string, InterestAccountBalanceType>
  afterTransaction: RemoteDataType<string, InterestAfterTransactionType>
  coin: CoinType
  instruments: RemoteDataType<string, EarnInstrumentsType>
  interestDepositLimits: EarnMinMaxType
  interestEDDDepositLimits: RemoteDataType<string, InterestDepositLimits>
  interestEDDStatus: RemoteDataType<string, InterestEDDStatus>
  interestEDDWithdrawLimits: RemoteDataType<string, WithdrawLimits>
  interestEligible: RemoteDataType<string, EarnEligibleType>
  interestLimits: RemoteDataType<string, InterestLimitsType>
  interestRates: RemoteDataType<string, RewardsRatesType['rates']>
  isAmountDisplayedInCrypto: boolean
  // make this optional here. places where ts doesnt like it, check, custodial
  payment?: RemoteDataType<string, PaymentValue | undefined>
  rewardsStep: {
    data: InterestStepMetadata
    name: InterestStep
  }
  stakingDepositLimits: EarnMinMaxType
  stakingEligible: RemoteDataType<string, EarnEligibleType>
  stakingLimits: RemoteDataType<string, StakingLimitsType>
  stakingRates: RemoteDataType<string, StakingRatesType['rates']>
  stakingStep: {
    data: InterestStepMetadata
    name: StakingStep
  }
  transactions: Array<InterestTransactionType>
  transactionsNextPage: string | null
  transactionsReport: RemoteDataType<string, Array<InterestTransactionType>>
  underSanctionsMessage: string | null
  withdrawalMinimums: RemoteDataType<string, WithdrawalMinimumType>
}
