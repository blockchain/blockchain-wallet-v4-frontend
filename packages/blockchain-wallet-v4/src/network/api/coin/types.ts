export type BalanceResponseType = {
  results: {
    balances: {
      amount: string
      identifier: 'native'
    }[]
    pubKey: string
  }[]
}

export type IndexMultiResponseType = {
  [key in string]: {
    price: number
    timestamp: number
    volume24h: number
  }
}

export type TickerResponseType = {
  [key in string]: {
    '15m': number
    buy: number
    last: number
    sell: number
    symbol: string
  }
}

export type TxHistoryResponseType = {
  addresses: {
    [key in string]: {
      descriptor: string
      pubKey: string
      style: 'SINGLE'
    }
  }
  history: SelfCustodyTxType[]
}

type SelfCustodyTxType = {
  extraData: {
    memo?: string
  }
  fee: string
  movements: {
    address: string
    amount: string
    identifier: 'native'
    type: 'SENT' | 'RECEIVED'
  }[]
  status: 'PENDING' | 'CONFIRMING' | 'COMPLETED' | 'FAILED'
  timestamp: number
  txId: string
}

export type IngestedSelfCustodyType = SelfCustodyTxType & {
  amount: string
  from: string
  to: string
  type: 'SENT' | 'RECEIVED'
}
