import { CoinType, FiatType } from '@core/types'

export type PropsType = {
  handleClose: () => void
  walletCurrency: FiatType
}

export type OwnProps = {
  coin: CoinType
  displaySymbol: string
  handleBuyClick: () => void
  handleClose: () => void
  handleReceiveClick: () => void
  isBuySellEligible: boolean
}
