import { CoinType } from '@core/types'

export type PropsType = {
  handleClose: () => void
}

export type SuccessPropsType = {
  activeRewardsCryptoAmount: string
  activeRewardsFiatAmount: string
  buysellCryptoAmount: string
  buysellFiatAmount: string
  coin: CoinType
  handleClose: () => void
  handleWithdrawal: () => void
}
