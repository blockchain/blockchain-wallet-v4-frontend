import {
  BeneficiaryType,
  CoinType,
  RemoteDataType,
  WithdrawalLockCheckResponseType
} from 'blockchain-wallet-v4/src/types'

export type SendState = {
  exchangePaymentsAccount: {
    [key in CoinType]: RemoteDataType<any, any>
  }
  tradingPaymentsAccount: {
    [key in CoinType]: RemoteDataType<any, BeneficiaryType>
  }
  withdrawLockCheck: RemoteDataType<string, WithdrawalLockCheckResponseType>
}
