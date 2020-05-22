import * as AT from './actionTypes'

export type ModalNamesType =
  | 'AirdropClaim'
  | 'BitPayInvoiceExpired'
  | 'BORROW_MODAL'
  | 'Confirm'
  | 'FAQ_MODAL'
  | 'INTEREST_MODAL'
  | 'KycDocResubmit'
  | 'LinkFromExchangeAccount'
  | 'LinkToExchangeAccount'
  | '@MODAL.REQUEST.ETH'
  | '@MODAL.SEND.BCH'
  | '@MODAL.SEND.BTC'
  | '@MODAL.SEND.ETH'
  | '@MODAL.SEND.XLM'
  | 'PairingCode'
  | 'RECOVERY_PHRASE_MODAL'
  | 'SIMPLE_BUY_MODAL'
  | 'SunRiverWelcome'
  | 'SwapGetStarted'
  | 'SwapUpgrade'
  | 'TransferEth'
  | 'TRANSACTION_REPORT'
  | 'UpgradeForAirdrop'
  | 'WELCOME_MODAL'
  | 'WHATS_NEW_MODAL'
  | 'WITHDRAWAL_MODAL'

export type ModalOriginType =
  | 'AirdropClaimGoal'
  | 'BorrowHistorySection'
  | 'BorrowLandingPage'
  | 'EmptyFeed'
  | 'KycDocResubmitGoal'
  | 'PaymentProtocolGoal'
  | 'PendingOrder'
  | 'PriceChart'
  | 'RetrySendEth'
  | 'RunKycGoal'
  | 'InterestPage'
  | 'SBEnterAmountCheckout'
  | 'Send'
  | 'SendBch'
  | 'SendBtc'
  | 'SendEth'
  | 'SendExchangePromo'
  | 'SendRequestTopNav'
  | 'SendXlm'
  | 'SettingsGeneral'
  | 'SettingsPage'
  | 'SettingsProfile'
  | 'SideNav'
  | 'TheExchangePage'
  | 'TransactionList'
  | 'Unknown'
  | 'WalletBalanceDropdown'
  | 'WelcomeModal'
  | 'WhatsNewHeader'

export type ModalPropsType = {
  [key: string]: any
  origin: ModalOriginType
}

export type ModalType = {
  options: any
  props: ModalPropsType
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
  | ShowModal
  | UpdateModalOptions
