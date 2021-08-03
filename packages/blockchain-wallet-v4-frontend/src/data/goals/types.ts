import { CoinType, WalletFiatType } from 'blockchain-wallet-v4/src/types'
import { ModalNameType } from 'data/modals/types'

// State
export type GoalsType =
  | 'airdropClaim'
  | 'kyc'
  | 'kycDocResubmit'
  | 'linkAccount'
  | 'payment'
  | 'paymentProtocol'
  | 'referral'
  | 'simpleBuy'
  | 'swap'
  | 'swapGetStarted'
  | 'swapUpgrade'
  | 'syncPit'
  | 'transferEth'
  | 'upgradeForAirdrop'
  | 'welcomeModal'
  | 'interest'
  | 'interestPromo'

export type GoalType = { data: any; id: string; name: GoalsType }
export type SimpleBuyWidgetGoalDataType = {
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
  initialRedirect: string
}

export enum DeepLinkGoal {
  BITCOIN = 'bitcoin',
  INTEREST = 'interest',
  KYC = 'kyc',
  LINK_ACCOUNT = 'link-account',
  LOG_LEVEL = 'log-level',
  REFERRAL = 'referral',
  SIMPLE_BUY = 'simple-buy',
  SWAP = 'swap'
}
