enum AnalyticsKey {
  AMOUNT_SWITCHED = 'Amount Switched',
  BUY_AMOUNT_ENTERED = 'Buy Amount Entered',
  BUY_AMOUNT_MAX_CLICKED = 'Buy Amount Max Clicked',
  BUY_AMOUNT_MIN_CLICKED = 'Buy Amount Min Clicked',
  BUY_PAYMENT_METHOD_SELECTED = 'Buy Payment Method Selected',
  BUY_SELL_CLICKED = 'Buy Sell Clicked',
  BUY_SELL_VIEWED = 'Buy Sell Viewed',
  DASHBOARD_CLICKED = 'Dashboard Clicked',
  DASHBOARD_VIEWED = 'Dashboard Viewed',
  EMAIL_VERIFICATION_REQUESTED = 'Email Verification Requested',
  RECEIVE_CURRENCY_SELECTED = 'Receive Currency Selected',
  RECEIVE_DETAILS_COPIED = 'Receive Details Copied',
  SEND_AMOUNT_MAX_CLICKED = 'Send Amount Max Clicked', // not implemented
  SEND_FEE_RATE_SELECTED = 'Send Fee Rate Selected', // not implemented
  SEND_FROM_SELECTED = 'Send From Selected', // not implemented
  SEND_RECEIVE_CLICKED = 'Send Receive Clicked', // half implemented
  SEND_RECEIVE_VIEWED = 'Send Receive Viewed', // half implemented
  SEND_SUBMITTED = 'Send Submitted', // not implemented
  SIGNED_IN = 'Signed In',
  SIGNED_OUT = 'Signed Out',
  SWAP_ACCOUNTS_SELECTED = 'Swap Accounts Selected',
  SWAP_AMOUNT_ENTERED = 'Swap Amount Entered',
  SWAP_AMOUNT_MAX_CLICKED = 'Swap Amount Max Clicked',
  SWAP_AMOUNT_MIN_CLICKED = 'Swap Amount Min Clicked',
  SWAP_CLICKED = 'Swap Clicked',
  SWAP_FROM_SELECTED = 'Swap From Selected',
  SWAP_RECEIVE_SELECTED = 'Swap Receive Selected',
  SWAP_REQUESTED = 'Swap Requested',
  SWAP_VIEWED = 'Swap Viewed',
  UPGRADE_VERIFICATION_CLICKED = 'Upgrade Verification Clicked'
}

enum AnalyticsType {
  EVENT = 'EVENT',
  VIEW = 'VIEW'
}

type BasePayload = {
  analyticsType: AnalyticsType
  id: string
  nabuId: string
  originalTimestamp: string
}

type PageViewPayload = {
  path: string
  referrer: string
  search: string
  title: string
  url: string
}

type AmountSwitchedPayload = BasePayload & {
  product: 'SAVINGS' | 'SIMPLEBUY' | 'SWAP'
  switch_to: 'CRYPTO' | 'FIAT'
}

type BuyAmountEnteredPayload = BasePayload & {
  input_amount: number
  input_currency: string
  max_card_limit: number
  output_currency: string
}

type BuyAmountMaxClickedPayload = BasePayload & {
  input_currency: string
  max_card_limit: number
  output_currency: string
}

type BuyAmountMinClickedPayload = BasePayload & {
  input_currency: string
  output_currency: string
}

type BuyPaymentMethodSelectedPayload = BasePayload & {
  payment_type: 'BANK_ACCOUNT' | 'BANK_TRANSFER' | 'FUNDS' | 'PAYMENT_CARD'
}

type BuySellClickedPayload = BasePayload & {
  origin: string
  type: 'BUY' | 'SELL'
}

type BuySellViewedPayload = BasePayload &
  PageViewPayload & {
    type: 'BUY' | 'SELL'
  }

type DashboardClickedPayload = BasePayload & {
  origin: 'SIGN_IN'
}

type DashboardViewedPayload = BasePayload & PageViewPayload & {}

type EmailVerificationClicked = BasePayload & {
  // origin: 'SIGN_UP' | 'VERIFICATION'
}

type ReceiveCurrencySelectedPayload = BasePayload & {
  account_type: 'SAVINGS' | 'TRADING' | 'USERKEY'
  currency: string
}

type ReceiveDetailsCopiedPayload = BasePayload & {
  account_type: 'SAVINGS' | 'TRADING' | 'USERKEY'
  currency: string
}

type SendAmountMaxClickedPayload = BasePayload & {
  currency: string
  from_account_type: 'SAVINGS' | 'TRADING' | 'USERKEY'
  to_account_type: 'SAVINGS' | 'TRADING' | 'USERKEY'
}

type SendFeeRateSelectedPayload = BasePayload & {
  currency: string
  fee_rate: 'CUSTOM' | 'NORMAL' | 'PRIORITY'
  from_account_type: 'SAVINGS' | 'TRADING' | 'USERKEY'
  to_account_type: 'SAVINGS' | 'TRADING' | 'USERKEY'
}

type SendFromSelectedPayload = BasePayload & {
  currency: string
  from_account_type: 'SAVINGS' | 'TRADING' | 'USERKEY'
}

type SendReceiveClickedPayload = BasePayload & {
  origin: 'NAVIGATION'
  type: 'RECEIVE' | 'SEND'
}

type SendReceiveViewedPayload = BasePayload & {
  type: 'RECEIVE' | 'SEND'
}

type SendSubmittedPayload = BasePayload & {
  currency: string
  fee_rate: 'CUSTOM' | 'NORMAL' | 'PRIORITY'
  from_account_type: 'SAVINGS' | 'TRADING' | 'USERKEY'
  to_account_type: 'SAVINGS' | 'TRADING' | 'USERKEY'
}

type SignedInPayload = BasePayload & {}

type SignedOutPayload = BasePayload & {}

type SwapClickedPayload = BasePayload & {
  origin: 'CURRENCY_PAGE' | 'DASHBOARD_PROMO' | 'NAVIGATION'
}

type SwapViewedPayload = BasePayload & PageViewPayload & {}

type SwapAccountsSelectedPayload = BasePayload & {
  input_currency: string
  input_type: 'TRADING' | 'USERKEY'
  output_currency: string
  output_type: 'TRADING' | 'USERKEY'
}

type SwapAmountEnteredPayload = BasePayload & {
  input_amount: number
  input_currency: string
  input_type: 'TRADING' | 'USERKEY'
  output_amount: number
  output_currency: string
  output_type: 'TRADING' | 'USERKEY'
}

type SwapAmountMaxClickedPayload = BasePayload & {
  input_currency: string
  input_type: 'TRADING' | 'USERKEY'
  output_currency: string
  output_type: 'TRADING' | 'USERKEY'
}

type SwapAmountMinClickedPayload = BasePayload & {
  input_currency: string
  input_type: 'TRADING' | 'USERKEY'
  output_currency: string
  output_type: 'TRADING' | 'USERKEY'
}

type SwapFromSelectedPayload = BasePayload & {
  input_currency: string
  input_type: 'TRADING' | 'USERKEY'
}

type SwapReceiveSelectedPayload = BasePayload & {
  input_currency: string
  input_type: 'TRADING' | 'USERKEY'
}

type SwapRequested = BasePayload & {
  exchange_rate: number
  input_amount: number
  input_currency: string
  input_type: string
  network_fee_input_amount: number
  network_fee_input_currency: string
  network_fee_output_amount: number
  network_fee_output_currency: string
  output_amount: number
  output_currency: string
  output_type: string
}

type UpgradeVerificationClickedPayload = BasePayload & {
  // origin:
  //   | 'AIRDROP'
  //   | 'FIAT_FUNDS'
  //   | 'RESUBMISSION'
  //   | 'SAVINGS'
  //   | 'SETTINGS'
  //   | 'SIMPLEBUY'
  //   | 'SIMPLETRADE'
  //   | 'SWAP'
  tier: number
}

type AnalyticsPayload =
  | AmountSwitchedPayload
  | BuyAmountEnteredPayload
  | BuyAmountMaxClickedPayload
  | BuyAmountMinClickedPayload
  | BuyPaymentMethodSelectedPayload
  | BuySellClickedPayload
  | BuySellViewedPayload
  | DashboardClickedPayload
  | DashboardViewedPayload
  | EmailVerificationClicked
  | ReceiveCurrencySelectedPayload
  | ReceiveDetailsCopiedPayload
  | SendAmountMaxClickedPayload
  | SendFeeRateSelectedPayload
  | SendFromSelectedPayload
  | SendReceiveClickedPayload
  | SendReceiveViewedPayload
  | SendSubmittedPayload
  | SignedInPayload
  | SignedOutPayload
  | SwapClickedPayload
  | SwapViewedPayload
  | SwapAccountsSelectedPayload
  | SwapAmountEnteredPayload
  | SwapAmountMaxClickedPayload
  | SwapAmountMinClickedPayload
  | SwapFromSelectedPayload
  | SwapReceiveSelectedPayload
  | SwapRequested
  | UpgradeVerificationClickedPayload

type PageNamesType = '/home'
// | '/interest'
// | '/settings/general'
// | '/settings/preferences'
// | '/settings/addresses'

export type { AnalyticsPayload, PageNamesType }

export { AnalyticsKey, AnalyticsType }
