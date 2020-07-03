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
  | 'swapGetStarted'
  | 'swapUpgrade'
  | 'syncPit'
  | 'transferEth'
  | 'upgradeForAirdrop'
  | 'welcomeModal'
  | 'xlmPayment'

export type GoalsState = {
  goals: Array<{ data: any; id: string; name: GoalsType }>
  initialModalDisplayed: boolean
  initialModals:
    | {
        [key in GoalsType]: { data: any; key: key; name: ModalNamesType }
      }
    | {}
}
