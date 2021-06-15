import * as AT from './actionTypes'

export type ModalNamesType =
  | 'KYC_MODAL'
  | 'KYC_RESUBMIT_MODAL'
  | 'KYC_TIER_UPGRADE_MODAL'
  | 'SEND_BCH_MODAL'
  | 'SEND_BTC_MODAL'
  | 'SEND_ETH_MODAL'
  | 'SEND_XLM_MODAL'
  | 'ADD_BTC_WALLET_MODAL'
  | 'AIRDROP_CLAIM_MODAL'
  | 'AIRDROP_SUCCESS_MODAL'
  | 'BANK_DEPOSIT_MODAL'
  | 'BITPAY_INVOICE_EXPIRED_MODAL'
  | 'BORROW_MODAL'
  | 'ADD_BANK_YAPILY_MODAL'
  | 'ADD_BANK_YODLEE_MODAL'
  | 'BANK_DETAILS_MODAL'
  | 'REMOVE_BANK_MODAL'
  | 'CONFIRMATION_MODAL'
  | 'CUSTODY_WITHDRAW_MODAL'
  | 'DELETE_ADDRESS_LABEL_MODAL'
  | 'EDIT_TX_DESCRIPTION_MODAL'
  | 'IMPORT_BTC_ADDRESS_MODAL'
  | 'INTEREST_PROMO_MODAL'
  | 'INTEREST_MODAL'
  | 'LINK_FROM_EXCHANGE_ACCOUNT_MODAL'
  | 'LINK_TO_EXCHANGE_ACCOUNT_MODAL'
  | 'PAIRING_CODE_MODAL'
  | 'RECOVERY_PHRASE_MODAL'
  | 'REQUEST_CRYPTO_MODAL'
  | 'SHOW_BTC_PRIVATE_KEY_MODAL'
  | 'SHOW_USED_ADDRESS_MODAL'
  | 'SHOW_XPUB_MODAL'
  | 'SIGN_MESSAGE_MODAL'
  | 'SIMPLE_BUY_MODAL'
  | 'SWAP_MODAL'
  | 'SWAP_GET_STARTED_MODAL'
  | 'TRANSACTION_REPORT_MODAL'
  | 'TRANSFER_ETH_MODAL'
  | 'TRADING_LIMITS'
  | 'UPGRADE_FOR_AIRDROP_MODAL'
  | 'VERIFY_MESSAGE_AIRDROP'
  | 'WELCOME_MODAL'

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
  | 'Goals'
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
  | 'CurrencyList'

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

export type ModalActionTypes = CloseAllModals | CloseModal | ShowModal | UpdateModalOptions
