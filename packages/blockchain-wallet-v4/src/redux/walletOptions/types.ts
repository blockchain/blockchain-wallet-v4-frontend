import { CoinType } from '../../types'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'

export type SupportedCoinType = {
  availability: {
    exchangeFrom: boolean
    exchangeTo: boolean
    lockbox: boolean
    request: boolean
    send: boolean
    syncToPit: boolean
  }
  coinCode: string
  coinTicker: string
  colorCode: 'btc' | 'bch' | 'eth' | 'xlm' | 'pax' | 'stx'
  config: {
    network: string
  }
  displayName: string
  hasLockboxSupport: boolean
  icons: {
    circle: keyof IcoMoonType
    circleFilled: keyof IcoMoonType
    default: keyof IcoMoonType
  }
  learnMoreLink: string
  minConfirmations: number
  txExplorerBaseUrl: string
  txListAppRoute: string
}

export type SupportedCoinsType = {
  [key in CoinType]: SupportedCoinType
}
