import * as AT from './actionTypes'

export type ModalNamesType =
  | 'BORROW_MODAL'
  | 'FAQ_MODAL'
  | 'LinkFromExchangeAccount'
  | 'ShowEthPrivateKey'
  | 'ShowXlmPrivateKey'
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
