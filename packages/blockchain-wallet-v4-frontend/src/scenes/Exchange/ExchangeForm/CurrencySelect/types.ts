import { CoinType } from 'core/types'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'

export type SwapAccountType = {
  text: string
  value?: {
    address: number | string
    archived: boolean
    balance: number
    coin: CoinType
    icon: keyof IcoMoonType
    label: string
    noAccount: boolean
    type: 'ACCOUNT'
  }
}

export type GroupHeadingLabelType = {
  coin: CoinType
  icon: keyof IcoMoonType
  name: string
}
