import { ModalNamesType } from 'data/modals/types'

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
  | 'xlmPayment'
  | 'interest'

export type GoalsState = {
  goals: Array<{ data: any; id: string; name: GoalsType }>
  initialModalDisplayed: boolean
  initialModals:
    | {
        [key in GoalsType]: { data: any; key: key; name: ModalNamesType }
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
  SWAP = 'swap',
  XLM = 'xlm'
}
