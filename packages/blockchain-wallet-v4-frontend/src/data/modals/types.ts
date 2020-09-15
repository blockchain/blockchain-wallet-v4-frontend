import * as AT from './actionTypes'

export type ModalNamesType =
  | '@EXCHANGE.ETH_AIRDROP_MODAL'
  | '@EXCHANGE.RESULTS_MODAL'
  | '@MODAL.REQUEST.BCH'
  | '@MODAL.REQUEST.BTC'
  | '@MODAL.REQUEST.ETH'
  | '@MODAL.REQUEST.XLM'
  | '@MODAL.SEND.BCH'
  | '@MODAL.SEND.BTC'
  | '@MODAL.SEND.ETH'
  | '@MODAL.SEND.XLM'
  | 'AddBtcWallet'
  | 'AirdropClaim'
  | 'AirdropSuccess'
  | 'BitPayInvoiceExpired'
  | 'BORROW_MODAL'
  | 'Confirm'
  | 'CUSTODY_WITHDRAW_MODAL'
  | 'DeleteAddressLabel'
  | 'FAQ_MODAL'
  | 'ImportBtcAddress'
  | 'INTEREST_MODAL'
  | 'KycDocResubmit'
  | 'LinkFromExchangeAccount'
  | 'LinkToExchangeAccount'
  | 'Onfido'
  | 'PairingCode'
  | 'RECOVERY_PHRASE_MODAL'
  | 'ShowBtcPrivateKey'
  | 'ShowUsedAddresses'
  | 'ShowXPub'
  | 'SignMessage'
  | 'SIMPLE_BUY_MODAL'
  | 'SunRiverWelcome'
  | 'SwapGetStarted'
  | 'SwapUpgrade'
  | 'TRANSACTION_REPORT'
  | 'TransferEth'
  | 'UpgradeForAirdrop'
  | 'VerifyMessage'
  | 'WELCOME_MODAL'
  | 'WHATS_NEW_MODAL'
  | 'WITHDRAWAL_MODAL'

export type ModalOriginType =
  | 'AirdropClaimGoal'
  | 'BorrowHistorySection'
  | 'BorrowLandingPage'
  | 'EmptyFeed'
  | 'ExchangeForm'
  | 'FeaturesTopNav'
  | 'Header'
  | 'InterestPage'
  | 'KycDocResubmitGoal'
  | 'KycRequiredStep'
  | 'PaymentProtocolGoal'
  | 'PendingOrder'
  | 'PriceChart'
  | 'Request'
  | 'RetrySendEth'
  | 'RunKycGoal'
  | 'SBEnterAmountCheckout'
  | 'SBPaymentMethodSelection'
  | 'Send'
  | 'SendBch'
  | 'SendBtc'
  | 'SendEth'
  | 'SendExchangePromo'
  | 'SendXlm'
  | 'SettingsGeneral'
  | 'SettingsPage'
  | 'SettingsProfile'
  | 'SideNav'
  | 'SwapGetStarted'
  | 'TheExchangePage'
  | 'TransactionList'
  | 'Unknown'
  | 'WalletBalanceDropdown'
  | 'WelcomeModal'
  | 'WhatsNewHeader'
  | 'WithdrawModal'

export type ModalParamPropsType = {
  [key: string]: any
  origin: ModalOriginType
}

export type ModalType = {
  options: any
  props: ModalParamPropsType
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
