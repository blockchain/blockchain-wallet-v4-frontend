enum AnalyticsKey {
  AMOUNT_SWITCHED = 'Amount Switched',
  BUY_AMOUNT_ENTERED = 'Buy Amount Entered',
  BUY_AMOUNT_MAX_CLICKED = 'Buy Amount Max Clicked',
  BUY_AMOUNT_MIN_CLICKED = 'Buy Amount Min Clicked',
  // BUY_LEARN_MORE_CLICKED = 'Buy Learn More Clicked', // doesn't exist on the web
  BUY_PAYMENT_METHOD_SELECTED = 'Buy Payment Method Selected',
  BUY_SELL_CLICKED = 'Buy Sell Clicked',
  BUY_SELL_VIEWED = 'Buy Sell Viewed',
  CARD_REJECTED = 'Card Rejected',
  DASHBOARD_CLICKED = 'Dashboard Clicked',
  DASHBOARD_VIEWED = 'Dashboard Viewed',
  EMAIL_VERIFICATION_REQUESTED = 'Email Verification Requested',
  SIGNED_IN = 'Signed In',
  SIGNED_OUT = 'Signed Out',
  // SWAP_ACCOUNTS_SELECTED = 'Swap Accounts Selected', // not implemented
  // SWAP_AMOUNT_ENTERED = 'Swap Amount Entered', // not implemented
  // SWAP_AMOUNT_MAX_CLICKED = 'Swap Amount Max Clicked', // not implemented
  // SWAP_AMOUNT_MIN_CLICKED = 'Swap Amount Min Clicked', // not implemented
  SWAP_CLICKED = 'Swap Clicked',
  // SWAP_FROM_SELECTED = 'Swap From Selected', // not implemented
  // SWAP_RECEIVE_SELECTED = 'Swap Receive Selected', // not implemented
  // SWAP_REQUESTED = 'Swap Requested' // not implemented
  SWAP_VIEWED = 'Swap Viewed',
  UPGRADE_VERIFICATION_CLICKED = 'Upgrade Verification Clicked'
}

enum AnalyticsType {
  EVENT = 'EVENT',
  VIEW = 'VIEW'
}

type BasePayload = {
  id: string
  nabuId: string
  originalTimestamp: string
  type: AnalyticsType
}

type PageViewPayload = {
  path: string
  referrer: string
  search: string
  title: string
  url: string
}

type BuyAmountEnteredPayload = BasePayload & {
  input_amount: number
  input_currency: string
  max_card_limit: number
  output_currency: string
  platform: 'WALLET'
}

type BuyAmountMaxClickedPayload = BasePayload & {
  input_currency: string
  max_card_limit: number
  output_currency: string
  platform: 'WALLET'
}

type BuyAmountMinClickedPayload = BasePayload & {
  input_currency: string
  output_currency: string
  platform: 'WALLET'
}

type BuyPaymentMethodSelectedPayload = BasePayload & {
  payment_type: 'BANK_ACCOUNT' | 'BANK_TRANSFER' | 'FUNDS' | 'PAYMENT_CARD'
  platform: 'WALLET'
}

type BuySellClickedPayload = BasePayload & {
  origin: 'BUY_WIDGET' | string
  // type: "BUY" | "SELL"
}

type BuySellViewedPayload = BasePayload &
  PageViewPayload & {
    // type: "BUY" | "SELL"
  }

type CardRejectedPayload = BasePayload & {
  card_type: string
  country_billing: string
  product: 'SIMPLE_BUY' | 'SIMPLE_TRADE' | 'SWAP'
  reason: string
}

type SwapClickedPayload = BasePayload & {
  origin: 'CURRENCY_PAGE' | 'DASHBOARD_PROMO' | 'NAVIGATION'
}

type SwapViewedPayload = BasePayload & PageViewPayload & {}

type DashboardClickedPayload = BasePayload & {
  origin: 'SIGN_IN'
}

type DashboardViewedPayload = BasePayload & PageViewPayload & {}

type EmailVerificationClicked = BasePayload & {
  // origin: 'SIGN_UP' | 'VERIFICATION'
}

type SignedInPayload = BasePayload & {
  platform: 'WALLET'
}

type SignedUpPayload = BasePayload & {
  platform: 'WALLET'
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
  | BuyAmountEnteredPayload
  | BuyAmountMaxClickedPayload
  | BuyAmountMinClickedPayload
  | BuyPaymentMethodSelectedPayload
  | BuySellClickedPayload
  | BuySellViewedPayload
  | CardRejectedPayload
  | SwapClickedPayload
  | SwapViewedPayload
  | DashboardClickedPayload
  | DashboardViewedPayload
  | EmailVerificationClicked
  | SignedInPayload
  | SignedUpPayload
  | UpgradeVerificationClickedPayload

type PageNamesType = '/home'
// | '/interest'
// | '/borrow'
// | '/settings/general'
// | '/settings/preferences'
// | '/settings/addresses'

export type { AnalyticsPayload, PageNamesType }

export { AnalyticsKey, AnalyticsType }
