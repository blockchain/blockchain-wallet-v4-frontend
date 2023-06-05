import { DexSwapQuoteWithDate } from 'data/types'

export type QuoteDetailsProps = {
  handleSettingsClick?: () => void
  isDetailsOpen: boolean
  slippage: number
  walletCurrency: string
} & (
  | {
      isQuoteLoading: true
    }
  | {
      isQuoteLoading: false
      swapQuote: DexSwapQuoteWithDate
    }
)
