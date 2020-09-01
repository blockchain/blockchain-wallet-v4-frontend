import { BeneficiaryType, CoinType, RemoteDataType } from 'core/types'

export type SendState = {
  exchangePaymentsAccount: {
    [key in CoinType]: RemoteDataType<any, any>
  }
  tradingPaymentsAccount: {
    [key in CoinType]: RemoteDataType<any, BeneficiaryType>
  }
}
