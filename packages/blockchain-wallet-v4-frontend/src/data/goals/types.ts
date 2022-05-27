import { CoinType, WalletFiatType } from '@core/types'
import { ModalNameType } from 'data/modals/types'

// State
export type GoalsType =
  | 'airdropClaim'
  | 'kycUpgradeRequiredNotice'
  | 'termsAndConditions'
  | 'kyc'
  | 'kycDocResubmit'
  | 'linkAccount'
  | 'changePassword'
  | 'payment'
  | 'paymentProtocol'
  | 'referral'
  | 'buySell'
  | 'buy-nft'
  | 'make-offer-nft'
  | 'nfts'
  | 'settings'
  | 'sanctionsNotice'
  | 'swap'
  | 'swapGetStarted'
  | 'swapUpgrade'
  | 'syncPit'
  | 'transferEth'
  | 'upgradeForAirdrop'
  | 'walletConnect'
  | 'welcomeModal'
  | 'interest'
  | 'interestPromo'

export type GoalType = { data: any; id: string; name: GoalsType }
export type BuySellWidgetGoalDataType = {
  amount: string
  crypto: CoinType
  email?: string
  fiatCurrency: WalletFiatType
}

export enum UnifiedAccountRedirectType {
  CHANGE_2FA = 'change2fa',
  CHANGE_EMAIL = 'changeEmail',
  CHANGE_PASSWORD = 'changePassword'
}
export enum GeneralRedirectType {
  REWARDS = 'rewards'
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
  INTEREST = 'interest',
  KYC = 'kyc',
  LINK_ACCOUNT = 'link-account',
  LOG_LEVEL = 'log-level',
  MAKE_OFFER_NFT = 'make-offer-nft',
  NFTS = 'nfts',
  REFERRAL = 'referral',
  REWARDS = 'rewards',
  SETTINGS = 'settings',
  SIMPLE_BUY = 'simple-buy',
  SWAP = 'swap',
  WALLET_CONNECT = 'wc'
}
