type EthRawConfirmedTxType = {
  blockHash: string
  blockNumber: string
  data?: string
  from: string
  gasLimit: string
  gasPrice: string
  gasUsed: string
  hash: string
  internalTransactions: Array<EthRawTxType>
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

export type EthRawTxType = EthRawConfirmedTxType | EthRawPendingTxType

export enum Erc20ListEnum {
  '0x8e870d67f660d95d5be530380d0ec0bd388289e1' = 'PAX'
}
