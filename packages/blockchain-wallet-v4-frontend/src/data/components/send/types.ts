import { CoinType, RemoteDataType } from 'core/types'

export type SendState = {
  exchangePaymentsAccount: {
    [key in CoinType]: RemoteDataType<any, any>
  }
}
