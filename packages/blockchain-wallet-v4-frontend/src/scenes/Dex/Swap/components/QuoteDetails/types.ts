import type { DexSwapQuote } from '@core/network/api/dex'

export type QuoteDetailsProps = {
  handleSettingsClick: () => void
  isDetailsOpen: boolean
  slippage: number
  walletCurrency: string
} & (
  | {
      isQuoteLoading: true
    }
  | {
      isQuoteLoading: false
      swapQuote: DexSwapQuote
    }
)
