import { CoinType } from '@core/types'

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
  toCurrency: {
    address: string
    chainId: number
    symbol: CoinType
  }
  userWalletPublicKey?: string
  venue: 'ZEROX'
}

export type DexSwapQuoteSuccessResponse = {
  approxConfirmationTime: number
  legs: number
  quotes: Array<SwapQuoteLegInfo>
  txs: Array<SwapQuoteTxInfo>
  type: 'SINGLE' | 'MULTI'
  venueType: 'AGGREGATOR' | 'ZEROX'
}

export type DexSwapQuoteErrorResponse = {
  code: number
  message: string
  type: string
}

export type DexSwapQuoteResponse = DexSwapQuoteSuccessResponse | DexSwapQuoteErrorResponse

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
  gas: string
  gasPrice: string
  to: string
  value: string
}
