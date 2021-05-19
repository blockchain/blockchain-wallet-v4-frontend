import {
  BeneficiaryType,
  RemoteDataType,
  WithdrawalLockCheckResponseType,
} from 'blockchain-wallet-v4/src/types'

export type SendState = {
  exchangePaymentsAccount: {
    [key in string]: RemoteDataType<any, any>
  }
  tradingPaymentsAccount: {
    [key in string]: RemoteDataType<any, BeneficiaryType>
  }
  withdrawLockCheck: RemoteDataType<string, WithdrawalLockCheckResponseType>
}
