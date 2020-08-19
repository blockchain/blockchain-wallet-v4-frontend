import { CoinType } from 'core/types'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'

export type GroupHeadingLabelType = {
  coin: CoinType
  icon: keyof IcoMoonType
  name: string
}
