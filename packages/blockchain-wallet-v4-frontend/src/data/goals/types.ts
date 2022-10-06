import { CoinType, WalletFiatType } from '@core/types'
import { ModalNameType } from 'data/modals/types'

// State
export type GoalsType =
  | 'airdropClaim'
  | 'buySell'
  | 'buy-nft'
  | 'cowboys2022'
  | 'dex'
  | 'kyc'
  | 'kycDocResubmit'
  | 'kycUpgradeRequiredNotice'
  | 'interest'
  | 'interestPromo'
  | 'linkAccount'
  | 'payment'
  | 'paymentProtocol'
  | 'make-offer-nft'
  | 'nfts'
  | 'referral'
  | 'rewards'
  | 'sanctionsNotice'
  | 'settings'
  | 'signup'
  | 'swap'
  | 'swapGetStarted'
  | 'swapUpgrade'
  | 'syncPit'
  | 'termsAndConditions'
  | 'transferEth'
  | 'upgradeForAirdrop'
  | 'welcomeModal'

export type GoalType = { data: any; id: string; name: GoalsType }
export type BuySellWidgetGoalDataType = {
  amount: string
  crypto: CoinType
  email?: string
  fiatCurrency: WalletFiatType
}

export type SignUpGoalDataType = {
  email?: string
}

export enum UnifiedAccountRedirectType {
  CHANGE_2FA = 'change2fa',
  CHANGE_EMAIL = 'changeEmail',
  CHANGE_PASSWORD = 'changePassword'
}
export enum GeneralRedirectType {
  EARN = 'earn'
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
  BUY_NFT = 'buy-nft',
  DEX = 'dex',
  EARN = 'earn',
  INTEREST = 'interest',
  KYC = 'kyc',
  LINK_ACCOUNT = 'link-account',
  LOG_LEVEL = 'log-level',
  MAKE_OFFER_NFT = 'make-offer-nft',
  NFTS = 'nfts',
  REFERRAL = 'referral',
  REWARDS = 'REWARDS',
  SETTINGS = 'settings',
  SIMPLE_BUY = 'simple-buy',
  SWAP = 'swap'
}
