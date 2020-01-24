import { CoinType } from '../../types'

export type SupportedCoinsType = {
  [key in CoinType]: {
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
    colorCode: string
    config: {
      network: string
    }
    displayName: string
    hasLockboxSupport: boolean
    icons: {
      circle: string
      circleFilled: string
      default: string
    }
    learnMoreLink: string
    minConfirmations: number
    txExplorerBaseUrl: string
    txListAppRoute: string
  }
}
