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
  DEPOSIT_AMOUNT_ENTERED = 'Deposit Amount Entered',
  DEPOSIT_CLICKED = 'Deposit Clicked',
  DEPOSIT_METHOD_SELECTED = 'Deposit Method Selected',
  DEPOSIT_VIEWED = 'Deposit Viewed',
  EMAIL_VERIFICATION_REQUESTED = 'Email Verification Requested',
  LINK_BANK_CLICKED = 'Link Bank Clicked',
  RECEIVE_CURRENCY_SELECTED = 'Receive Currency Selected',
  RECEIVE_DETAILS_COPIED = 'Receive Details Copied',
  SELL_AMOUNT_ENTERED = 'Sell Amount Entered',
  SELL_AMOUNT_MAX_CLICKED = 'Sell Amount Max Clicked',
  SELL_AMOUNT_MIN_CLICKED = 'Sell Amount Min Clicked',
  SELL_FROM_SELECTED = 'Sell From Selected',
  SEND_AMOUNT_MAX_CLICKED = 'Send Amount Max Clicked', // blocked
  SEND_FEE_RATE_SELECTED = 'Send Fee Rate Selected', // blocked
  SEND_FROM_SELECTED = 'Send From Selected', // blocked
  SEND_RECEIVE_CLICKED = 'Send Receive Clicked', // half implemented
  SEND_RECEIVE_VIEWED = 'Send Receive Viewed', // half implemented
  SEND_SUBMITTED = 'Send Submitted', // blocked
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
  UPGRADE_VERIFICATION_CLICKED = 'Upgrade Verification Clicked',
  WITHDRAWAL_AMOUNT_ENTERED = 'Withdrawal Amount Entered',
  WITHDRAWAL_AMOUNT_MAX_CLICKED = 'Withdrawal Amount Max Clicked',
  WITHDRAWAL_AMOUNT_MIN_CLICKED = 'Withdrawal Amount Min Clicked',
  WITHDRAWAL_CLICKED = 'Withdrawal Clicked',
  WITHDRAWAL_METHOD_SELECTED = 'Withdrawal Method Selected',
  WITHDRAWAL_VIEWED = 'Withdrawal Viewed',
  WRONG_CHANGE_CACHE = 'Wrong Change Cache',
  WRONG_RECEIVE_CACHE = 'Wrong Receive Cache'
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

enum DepositMethodType {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

enum SendReceiveType {
  RECEIVE = 'RECEIVE',
  SEND = 'SEND'
}

enum WithdrawalMethodType {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  BANK_TRANSFER = 'BANK_TRANSFER'
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

type PageNamesType = '/home'
// | '/interest'
// | '/settings/general'
// | '/settings/preferences'
// | '/settings/addresses'

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

type DepositAmountEnteredPayload = BasePayload & {
  amount: number
  currency: string
  deposit_method: DepositMethodType
}

type DepositClickedPayload = BasePayload & {
  origin: 'CURRENCY_PAGE' | 'PORTFOLIO'
}

type DepositMethodSelectedPayload = BasePayload & {
  currency: string
  deposit_method: DepositMethodType
}

type DepositViewedPayload = BasePayload & PageViewPayload & {}

type EmailVerificationClickedPayload = BasePayload & {
  // origin: 'SIGN_UP' | 'VERIFICATION'
}

type LinkBankClickedPayload = BasePayload & {
  // origin: 'BUY' |'DEPOSIT' | 'SETTINGS' | 'WITHDRAW'
}

type ReceiveCurrencySelectedPayload = BasePayload & {
  account_type: AccountType
  currency: string
}

type ReceiveDetailsCopiedPayload = BasePayload & {
  account_type: AccountType
  currency: string
}

type SellAmountEnteredPayload = BasePayload & {
  from_account_type: AccountType
  input_amount: number
  input_currency: string
  output_currency: string
}

type SellAmountMaxClickedPayload = BasePayload & {
  from_account_type: AccountType
  input_currency: string
  output_currency: string
}

type SellAmountMinClickedPayload = BasePayload & {
  from_account_type: AccountType
  input_currency: string
  output_currency: string
}

type SellFromSelectedPayload = BasePayload & {
  from_account_type: AccountType
  input_currency: string
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

type SwapRequestedPayload = BasePayload & {
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

type WithdrawalAmountEnteredPayload = BasePayload & {
  currency: string
  input_amount: number
  output_amount: number
  withdrawal_method: WithdrawalMethodType
}

type WithdrawalAmountMaxClickedPayload = BasePayload & {
  currency: string
  withdrawal_method: WithdrawalMethodType
}
type WithdrawalAmountMinClickedPayload = BasePayload & {
  currency: string
  withdrawal_method: WithdrawalMethodType
}

type WithdrawalClickedPayload = BasePayload & {
  // origin: 'CURRENCY_PAGE' | 'PORTFOLIO'
}

type WithdrawalMethodSelectedPayload = BasePayload & {
  currency: string
  withdrawal_method: WithdrawalMethodType
}

type WithdrawalViewedPayload = BasePayload & PageViewPayload & {}

type WrongChangeCachePayload = BasePayload & {}

type WrongReceiveCachePayload = BasePayload & {}

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
  | DepositAmountEnteredPayload
  | DepositClickedPayload
  | DepositMethodSelectedPayload
  | DepositViewedPayload
  | EmailVerificationClickedPayload
  | LinkBankClickedPayload
  | ReceiveCurrencySelectedPayload
  | ReceiveDetailsCopiedPayload
  | SellAmountEnteredPayload
  | SellAmountMaxClickedPayload
  | SellAmountMinClickedPayload
  | SellFromSelectedPayload
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
  | SwapRequestedPayload
  | UpgradeVerificationClickedPayload
  | WithdrawalAmountEnteredPayload
  | WithdrawalAmountMaxClickedPayload
  | WithdrawalAmountMinClickedPayload
  | WithdrawalClickedPayload
  | WithdrawalViewedPayload
  | WithdrawalMethodSelectedPayload
  | WrongChangeCachePayload
  | WrongReceiveCachePayload

export type { AnalyticsPayload, PageNamesType }

export {
  AccountType,
  AnalyticsKey,
  AnalyticsType,
  CoinType,
  DepositMethodType,
  FeeRateType,
  OrderType,
  PaymentType,
  SendReceiveType,
  WithdrawalMethodType
}
