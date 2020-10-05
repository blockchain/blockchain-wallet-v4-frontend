type EthRawConfirmedTxType = {
  blockHash: string
  blockNumber: string
  data?: string
  from: string
  gasLimit: string
  gasPrice: string
  gasUsed: string
  hash: string
  internalTransactions: Array<RawEthTxType>
  nonce: string
  state: 'CONFIRMED'
  success: boolean
  timestamp: string
  to: string
  transactionIndex: string
  value: string
}

type EthRawPendingTxType = {
  data?: string
  from: string
  gasLimit: string
  gasPrice: string
  hash: string
  internalTransactions: []
  nonce: string
  state: 'PENDING'
  timestamp: string
  to: string
  value: string
}

export type RawEthTxType = EthRawConfirmedTxType | EthRawPendingTxType

export type RawEthTxResponseType = {
  page: string
  size: number
  transactions: Array<RawEthTxType>
}

export type RawErc20TxType = {
  accountIdxFrom: string
  accountIdxTo: string
  blockHash: string
  blockNumber: string
  decimals: number
  from: string
  idxFrom: string
  idxTo: string
  logIndex: string
  timeStamp?: string
  timestamp: string
  to: string
  tokenHash: string
  transactionHash: string
  value: string
}

export type RawErc20TxResponseType = {
  page: string
  size: number
  transfers: Array<RawErc20TxType>
}

export enum Erc20ListEnum {
  '0x8e870d67f660d95d5be530380d0ec0bd388289e1' = 'PAX'
}

export enum Erc20CoinsEnum {
  PAX = 'PAX',
  USDT = 'USDT'
}
