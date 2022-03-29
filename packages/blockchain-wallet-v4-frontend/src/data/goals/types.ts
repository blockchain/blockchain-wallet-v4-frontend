import { CoinType, WalletFiatType } from '@core/types'
import { ModalNameType } from 'data/modals/types'

// State
export type GoalsType =
  | 'entitiesMigration'
  | 'kycUpgradeRequiredNotice'
  | 'termsAndConditions'
  | 'kycDocResubmit'
  | 'linkAccount'
  | 'payment'
  | 'paymentProtocol'
  | 'referral'
  | 'buySell'
  | 'swapGetStarted'
  | 'swapUpgrade'
  | 'syncPit'
  | 'transferEth'
  | 'walletConnect'
  | 'welcomeModal'
  | 'interestPromo'

export type GoalType = { data: any; id: string; name: GoalsType }
export type BuySellWidgetGoalDataType = {
  amount: string
  crypto: CoinType
  email?: string
  fiatCurrency: WalletFiatType
}

export type GoalsState = {
  goals: Array<GoalType>
  initialModalDisplayed: boolean
  initialModals:
    | {
        [key in GoalsType]: { data: any; key: key; name: ModalNameType }
      }
    | {}
}

export enum DeepLinkGoal {
  BITCOIN = 'bitcoin',
  LINK_ACCOUNT = 'link-account',
  REFERRAL = 'referral',
  SIMPLE_BUY = 'simple-buy',
  WALLET_CONNECT = 'wc'
}
