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

enum AccountType {
  SAVINGS = 'SAVINGS',
  TRADING = 'TRADING',
  USERKEY = 'USERKEY'
}

enum CoinType {
  CRYPTO = 'CRYPTO',
  FIAT = 'FIAT'
}

enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL'
}

enum PaymentType {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  BANK_TRANSFER = 'BANK_TRANSFER',
  FUNDS = 'FUNDS',
  PAYMENT_CARD = 'PAYMENT_CARD'
}

enum FeeRateType {
  CUSTOM = 'CUSTOM',
  NORMAL = 'NORMAL',
  PRIORITY = 'PRIORITY'
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
  switch_to: CoinType
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
  payment_type: PaymentType
}

type BuySellClickedPayload = BasePayload & {
  origin: string
  type: OrderType
}

type BuySellViewedPayload = BasePayload &
  PageViewPayload & {
    type: OrderType
  }

type DashboardClickedPayload = BasePayload & {
  origin: 'SIGN_IN'
}

type DashboardViewedPayload = BasePayload & PageViewPayload & {}

type EmailVerificationClicked = BasePayload & {
  // origin: 'SIGN_UP' | 'VERIFICATION'
}

type ReceiveCurrencySelectedPayload = BasePayload & {
  account_type: AccountType
  currency: string
}

type ReceiveDetailsCopiedPayload = BasePayload & {
  account_type: AccountType
  currency: string
}

type SendAmountMaxClickedPayload = BasePayload & {
  currency: string
  from_account_type: AccountType
  to_account_type: AccountType
}

type SendFeeRateSelectedPayload = BasePayload & {
  currency: string
  fee_rate: FeeRateType
  from_account_type: AccountType
  to_account_type: AccountType
}

type SendFromSelectedPayload = BasePayload & {
  currency: string
  from_account_type: AccountType
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
  fee_rate: FeeRateType
  from_account_type: AccountType
  to_account_type: AccountType
}

type SignedInPayload = BasePayload & {}

type SignedOutPayload = BasePayload & {}

type SwapClickedPayload = BasePayload & {
  origin: 'CURRENCY_PAGE' | 'DASHBOARD_PROMO' | 'NAVIGATION'
}

type SwapViewedPayload = BasePayload & PageViewPayload & {}

type SwapAccountsSelectedPayload = BasePayload & {
  input_currency: string
  input_type: Omit<AccountType, AccountType.SAVINGS>
  output_currency: string
  output_type: Omit<AccountType, AccountType.SAVINGS>
}

type SwapAmountEnteredPayload = BasePayload & {
  input_amount: number
  input_currency: string
  input_type: Omit<AccountType, AccountType.SAVINGS>
  output_amount: number
  output_currency: string
  output_type: Omit<AccountType, AccountType.SAVINGS>
}

type SwapAmountMaxClickedPayload = BasePayload & {
  input_currency: string
  input_type: Omit<AccountType, AccountType.SAVINGS>
  output_currency: string
  output_type: Omit<AccountType, AccountType.SAVINGS>
}

type SwapAmountMinClickedPayload = BasePayload & {
  input_currency: string
  input_type: Omit<AccountType, AccountType.SAVINGS>
  output_currency: string
  output_type: Omit<AccountType, AccountType.SAVINGS>
}

type SwapFromSelectedPayload = BasePayload & {
  input_currency: string
  input_type: Omit<AccountType, AccountType.SAVINGS>
}

type SwapReceiveSelectedPayload = BasePayload & {
  input_currency: string
  input_type: Omit<AccountType, AccountType.SAVINGS>
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

export { AccountType, AnalyticsKey, AnalyticsType, CoinType, FeeRateType, OrderType, PaymentType }
