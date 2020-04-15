import * as AT from './actionTypes'

export type ModalNamesType =
  | 'AirdropClaim'
  | 'BitPayInvoiceExpired'
  | 'BORROW_MODAL'
  | 'Confirm'
  | 'FAQ_MODAL'
  | 'KycDocResubmit'
  | 'LinkFromExchangeAccount'
  | 'LinkToExchangeAccount'
  | '@MODAL.REQUEST.ETH'
  | '@MODAL.SEND.BCH'
  | '@MODAL.SEND.BTC'
  | '@MODAL.SEND.ETH'
  | '@MODAL.SEND.PAX'
  | '@MODAL.SEND.XLM'
  | 'RECOVERY_PHRASE_MODAL'
  | 'ShowEthPrivateKey'
  | 'ShowXlmPrivateKey'
  | 'SIMPLE_BUY_MODAL'
  | 'SunRiverWelcome'
  | 'SwapGetStarted'
  | 'SwapUpgrade'
  | 'TransferEth'
  | 'TRANSACTION_REPORT'
  | 'UpgradeForAirdrop'
  | 'WELCOME_MODAL'
  | 'WHATS_NEW_MODAL'

export type ModalType = {
  options: any
  props: any
  type: ModalNamesType
}

// State
export type ModalsState = Array<ModalType>

// Actions
interface CloseAllModals {
  type: typeof AT.CLOSE_ALL_MODALS
}

interface CloseModal {
  type: typeof AT.CLOSE_MODAL
}

interface ReplaceModal {
  payload: ModalType
  type: typeof AT.REPLACE_MODAL
}

interface ShowModal {
  payload: ModalType
  type: typeof AT.SHOW_MODAL
}

interface UpdateModalOptions {
  payload: {
    options: any
  }
  type: typeof AT.UPDATE_MODAL
}

export type ModalActionTypes =
  | CloseAllModals
  | CloseModal
  | ReplaceModal
  | ShowModal
  | UpdateModalOptions
