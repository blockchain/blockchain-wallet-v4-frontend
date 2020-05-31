import { ModalNamesType } from 'data/modals/types'

// State
export type GoalsType =
  | 'welcomeModal'
  | 'upgradeForAirdrop'
  | 'swapUpgrade'
  | 'swapGetStarted'
  | 'airdropClaim'
  | 'kycDocResubmit'

export type GoalsState = {
  goals: Array<{ data: any; id: string; name: GoalsType }>
  initialModalDisplayed: boolean
  initialModals:
    | {
        [key in GoalsType]: { data: any; key: key; name: ModalNamesType }
      }
    | {}
}
