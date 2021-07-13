import { Erc20CoinType, RemoteDataType } from 'core/types'

export type IOType = {
  accountIndex: number
  address: string
  amount: number
  change: boolean
  coinType: string
  isWatchOnly: boolean
  label: string
  receiveIndex: number
}
export type BtcProcessedTxType = {
  amount: number
  blockHeight: number
  description: string
  double_spend: boolean
  fee: RemoteDataType<string, number>
  from: string
  fromWatchOnly: boolean
  hash: string
  inputs: Array<IOType>
  insertedAt: number
  outputs: Array<IOType>
  rbf?: boolean
  time: number
  timeFormatted: string
  to: string
  toAddress: string
  toWatchOnly: boolean
  type: 'sent' | 'received' | 'transferred'
}
export type BtcTxType = BtcProcessedTxType & {
  coin: 'BTC'
}
export type BchTxType = BtcProcessedTxType & {
  coin: 'BCH'
}
export type EthProcessedTxType = {
  amount: number
  blockHeight: string
  coin: Erc20CoinType | 'ETH'
  description: undefined | string
  erc20: boolean
  fee: RemoteDataType<string, number>
  from: string
  hash: string
  insertedAt: number
  state: 'PENDING' | 'CONFIRMED'
  time: string
  timeFormatted: string
  to: string
  type: 'sent' | 'received' | 'transferred'
}
export type XlmTxType = {
  amount: string
  belongsToWallet: true
  blockHeight: number
  coin: 'XLM'
  description: string
  from: string
  hash: string
  insertedAt: number
  memo: undefined
  memoType: string
  pagingToken: string
  time: string
  to: string
  type: 'sent' | 'received' | 'transferred'
}

export type ProcessedTxType =
  | BtcTxType
  | BchTxType
  | EthProcessedTxType
  | XlmTxType
