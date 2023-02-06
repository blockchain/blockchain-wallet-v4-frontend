export type EthAccountSummaryType = {
  accountTransactions: {
    blockHash: string
    blockNumber: string
    firstSeen: string
    from: string
    gasLimit: string
    gasPrice: string
    gasUsed: string
    hash: string
    nonce: string
    state: string
    success: boolean
    timestamp: string
    to: string
    transactionIndex: string
    type: string
    value: string
  }[]
  balance: string
  hash: string
  internalTransactionCount: string
  nonce: string
  totalFees: string
  totalReceived: string
  totalSent: string
  transactionCount: string
}

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
