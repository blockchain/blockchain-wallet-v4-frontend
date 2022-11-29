import { CoinType } from '@core/types'

export type DexSwapQuoteQueryParams = {
  ccy: string
  product: string // TODO: Update to coin type after it's done for DEX form values
}

export type DexSwapQuoteRequest = {
  fromCurrency: {
    address: string
    amount: string
    chainId: number
    symbol: CoinType
  }
  params: {
    slippage: string | null
  }
  takerAddress: string
  toCurrency: {
    address: string
    chainId: number
    symbol: CoinType
  }
  venue: 'ZEROX'
}

export type DexSwapQuoteResponse = {
  approxConfirmationTime?: number
  code?: number
  legs?: number
  message?: string
  quotes?: Array<SwapQuoteLegInfo>
  txs?: Array<SwapQuoteTxInfo>
  type?: 'SINGLE' | 'MULTI' | string
  venueType?: 'AGGREGATOR' | 'ZEROX'
}

type SwapQuoteLegInfo = {
  buyAmount: {
    address: string
    amount: string
    chainId: number
    symbol: CoinType
  }
  estimatedPriceImpact: string
  guaranteedPrice: string
  price: string
  sellAmount: {
    address: string
    amount: string
    chainId: number
    symbol: CoinType
  }
}

type SwapQuoteTxInfo = {
  chainId: string
  data: string
  gasLimit: string
  gasPrice: string
  to: string
  value: string
}
