export type UnifiedBalancesResponseType = {
  currencies: [
    {
      account: { index: number; name: string }
      amount: { amount: string; precision: number } | null
      price: number
      ticker: string
      unconfirmed: { amount: string; precision: number }
    }
  ]
  subscriptions: [{ accounts: number; pubKeyCount: number; ticker: string }]
}

export type BuildTxFeeType = 'LOW' | 'NORMAL' | 'HIGH'

export type BuildTxIntentType = {
  additional_data?: { memo: string }
  amount: string
  currency: string
  destination: string
  fee: BuildTxFeeType | string
  maxVerificationVersion?: number
  sources: [{ descriptor: 'legacy'; pubKey: string; style: 'SINGLE' }]
  type: 'PAYMENT'
}

export type BuildTxResponseType = {
  preImages: {
    descriptor: null | string
    preImage: string
    signature?: string
    signatureAlgorithm: 'secp256k1'
    signingKey: string
  }[]
  rawTx: {
    payload: {
      anchorMode: number
      auth: {
        authType: number
        spendingCondition: {
          fee: string
          hashMode: number
          keyEncoding: number
          nonce: string
          signature: {
            data: string
            type: number
          }
          signer: string
        }
      }
      chainId: number
      payload: {
        amount: string
        memo: {
          content: string
          type: number
        }
        payloadType: number
        recipient: {
          address: {
            hash160: string
            type: number
            version: number
          }
          type: number
        }
        type: number
      }
      postConditionMode: number
      postConditions: {
        lengthPrefixBytes: number
        type: number
        values: []
      }
      version: number
    }
    version: number
  }
  summary: {
    absoluteFeeEstimate: string
    absoluteFeeMaximum: string
    amount: string
    balance: string
    relativeFee: string
  }
}

export type DeriveAddressResponseType = {
  results: {
    address: string
    default: boolean
    format: string
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

export type PubkeyServiceAuthenticationRequestType = {
  guid: string
  sharedKeyHash: string
}

export type PubkeyServiceAuthenticationInRequestType = {
  guidHash: string
  sharedKeyHash: string
}

export type PubkeyServiceSubscriptions = {
  currencies: { ticker: string }[]
}

export type SubscribeRequestType = {
  auth: PubkeyServiceAuthenticationInRequestType
  data: {
    account: {
      index: number
      name?: string
    }
    currency: string
    pubKeys: [
      {
        descriptor: 0 | 'p2wpkh' | 'legacy'
        pubKey: string
        style: 'SINGLE' | 'EXTENDED'
      }
    ]
  }[]
}

export type BalanceEntryResponseType = {
  currencies: [
    {
      account: { index: number; name: string }
      amount: { amount: string; precision: number } | null
      price: number
      ticker: string
      unconfirmed: { amount: string; precision: number } | null
    }
  ]
  subscriptions: [{ accounts: number; pubKeyCount: string; ticker: string }]
}

export type ActivityResponseType = {}
