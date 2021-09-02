import {
  AccountTypes,
  CoinType,
  FiatType,
  InterestAccountBalanceType,
  InterestAccountType,
  InterestAfterTransactionType,
  InterestEDDStatus,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestRateType,
  InterestTransactionType,
  PaymentValue,
  RemoteDataType,
  WithdrawalMinimumType,
  WithdrawLimits
} from 'blockchain-wallet-v4/src/types'

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

export type InterestMinMaxType = {
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

export type InterestStepMetadata = {
  depositSuccess?: boolean
  error?: string
  withdrawSuccess?: boolean
  withdrawalAmount?: number
}

export type InterestStep = keyof typeof InterestSteps

export type InterestTransactionsReportType = Array<Array<string>>

export type InterestHistoryCoinFormType = { coin: CoinType | 'ALL' }

export type ErrorStringType = { error: string }

export type InterestLimits = { coin: CoinType; currency: FiatType }

//
// State
//
export interface InterestState {
  account: RemoteDataType<string, InterestAccountType>
  accountBalance: RemoteDataType<string, InterestAccountBalanceType>
  afterTransaction: RemoteDataType<string, InterestAfterTransactionType>
  coin: CoinType
  depositLimits: InterestMinMaxType
  instruments: RemoteDataType<string, InterestInstrumentsType>
  interestEDDStatus: RemoteDataType<string, InterestEDDStatus>
  interestEDDWithdrawLimits: RemoteDataType<string, WithdrawLimits>
  interestEligible: RemoteDataType<string, InterestEligibleType>
  interestLimits: RemoteDataType<string, InterestLimitsType>
  interestRate: RemoteDataType<string, InterestRateType['rates']>
  isAmountDisplayedInCrypto: boolean
  // make this optional here. places where ts doesnt like it, check, custodial
  payment?: RemoteDataType<string, PaymentValue | undefined>
  step: {
    data: InterestStepMetadata
    name: InterestStep
  }
  transactions: Array<InterestTransactionType>
  transactionsNextPage: string | null
  transactionsReport: RemoteDataType<string, Array<InterestTransactionType>>
  withdrawalMinimums: RemoteDataType<string, WithdrawalMinimumType>
}
