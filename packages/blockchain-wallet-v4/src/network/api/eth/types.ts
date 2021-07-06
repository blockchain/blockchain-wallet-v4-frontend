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

export type AccountTokensBalancesResponseType = {
  tokenAccounts: {
    accountHash: string
    balance: string
    decimals: number
    tokenHash: string
    tokenSymbol: string
    totalReceived: string
    totalSent: string
    transferCount: string
  }[]
}

export type EthRawTxType = EthRawConfirmedTxType | EthRawPendingTxType
