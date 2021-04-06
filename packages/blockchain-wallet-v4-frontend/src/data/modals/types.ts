import * as AT from './actionTypes'

export type ModalNamesType =
  | '@KYC.IdentityVerification'
  | '@MODAL.SEND.BCH'
  | '@MODAL.SEND.BTC'
  | '@MODAL.SEND.ETH'
  | '@MODAL.SEND.XLM'
  | 'AddBtcWallet'
  | 'AirdropClaim'
  | 'AirdropSuccess'
  | 'BANK_DEPOSIT_MODAL'
  | 'BitPayInvoiceExpired'
  | 'BORROW_MODAL'
  | 'ADD_BANK_MODAL'
  | 'BANK_DETAILS_MODAL'
  | 'REMOVE_BANK_MODAL'
  | 'Confirm'
  | 'CUSTODY_WITHDRAW_MODAL'
  | 'DeleteAddressLabel'
  | 'EditTxDescription'
  | 'ImportBtcAddress'
  | 'InterestPromo'
  | 'INTEREST_MODAL'
  | 'KycDocResubmit'
  | 'KycTierUpgrade'
  | 'LinkFromExchangeAccount'
  | 'LinkToExchangeAccount'
  | 'PairingCode'
  | 'RECOVERY_PHRASE_MODAL'
  | 'REQUEST_CRYPTO_MODAL'
  | 'ShowBtcPrivateKey'
  | 'ShowUsedAddresses'
  | 'ShowXPub'
  | 'SignMessage'
  | 'SIMPLE_BUY_MODAL'
  | 'SWAP_MODAL'
  | 'SwapGetStarted'
  | 'TRANSACTION_REPORT'
  | 'TransferEth'
  | 'TRADING_LIMITS'
  | 'UpgradeForAirdrop'
  | 'VerifyMessage'
  | 'WELCOME_MODAL'
  | 'WITHDRAWAL_MODAL'

export type ModalOriginType =
  | 'AirdropClaimGoal'
  | 'AddBankModal'
  | 'BankDetailsModal'
  | 'BorrowHistorySection'
  | 'BorrowLandingPage'
  | 'BankDeposit'
  | 'DepositWithdrawalModal'
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
  | 'SellEmpty'
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
  | 'SimpleBuyLink'
  | 'Swap'
  | 'SwapGetStarted'
  | 'SwapPrompt'
  | 'SwapLimitPrompt'
  | 'SwapNoHoldings'
  | 'TheExchangePage'
  | 'TradingLimits'
  | 'TransactionList'
  | 'Unknown'
  | 'WalletBalanceDropdown'
  | 'WelcomeModal'
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
  payload: {
    modalName?: ModalNamesType
  }
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
