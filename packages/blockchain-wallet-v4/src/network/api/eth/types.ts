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
  '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e' = 'YFI',
  '0x123151402076fc819B7564510989e475c9cD93CA' = 'WDGLD',
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' = 'AAVE',
  '0x8e870d67f660d95d5be530380d0ec0bd388289e1' = 'PAX',
  '0xdac17f958d2ee523a2206206994597c13d831ec7' = 'USDT'
}

export enum Erc20CoinsEnum {
  AAVE = 'AAVE',
  PAX = 'PAX',
  USDT = 'USDT',
  WDGLD = 'WDGLD',
  YFI = 'YFI'
}
