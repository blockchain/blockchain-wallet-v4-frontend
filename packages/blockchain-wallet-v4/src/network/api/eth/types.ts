type EthRawConfirmedTxType = {
  blockHash: string
  blockNumber: string
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
