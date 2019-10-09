//
// CUSTOM VARIABLES
//
export const CUSTOM_VARIABLES = {
  KYC_TIER: {
    ID: 1,
    NAME: 'kyc_tier'
  },
  CRYPTO_BALANCES: {
    ID: 2,
    NAME: 'crypto_balances'
  }
}

//
// AB TESTS
//
export const AB_TESTS = {
  PIT_SIDE_NAV_TEST3: 'PitSidenavTest3',
  WALLET_PIT_SIGNUP: 'WalletPitSignup'
}

//
// EVENTS
// format: [event_category, event_action, ?event_name, ?event_value]
//
export const AB_TEST_GOALS = {
  PIT_LINKOUT_CLICKED: ['ab_test_goals', 'pit_linkout_clicked']
}
export const PREFERENCE_EVENTS = {
  GENERAL: {
    ENABLE_BTC_LINKS: 'enable_btc_links'
  },
  SECURITY: {
    VERIFY_DEVICE_ACCEPTED: [
      'preferences',
      'security',
      'verify_device_accepted'
    ],
    VERIFY_DEVICE_EMAIL_SENT: [
      'preferences',
      'security',
      'verify_device_email_sent'
    ],
    VERIFY_DEVICE_REJECTED: [
      'preferences',
      'security',
      'verify_device_rejected'
    ]
  }
}
export const SWAP_EVENTS = {
  ORDER_PREVIEW_ERROR: ['swap', 'order_form', 'order_preview_error'],
  USE_MIN: ['swap', 'order_form', 'use_min'],
  USE_MAX: ['swap', 'order_form', 'use_max']
}
export const TRANSACTION_EVENTS = {
  SEND: ['transactions', 'send'],
  REQUEST: ['transactions', 'request'],
  EDIT_DESCRIPTION: ['transactions', 'edit_description'],
  PAYMENT_REQUEST: ['transactions', 'payment_request'],
  SEND_FAILURE: ['send_failure'],
  VIEW_TX_ON_EXPLORER: ['transactions', 'view_tx_explorer'],
  BITPAY_URL_DEEPLINK: ['transactions', 'bitpay', 'bitpay_url_deeplink'],
  BITPAY_FAILURE: ['transactions', 'bitpay', 'bitpay_payment_failure'],
  BITPAY_SUCCESS: ['transactions', 'bitpay', 'bitpay_payment_success']
}

export const GENERAL_EVENTS = {
  VIEW_WHATS_NEW: ['general', 'view_whats_new'],
  VIEW_FAQ: ['general', 'view_faq'],
  WALLET_INTRO_DISMISSED: ['general', 'wallet_intro_tour', 'dismissed'],
  WALLET_INTRO_OFFERED: ['general', 'wallet_intro_tour', 'offered'],
  WALLET_INTRO_STARTED: ['general', 'wallet_intro_tour', 'started'],
  WALLET_INTRO_PORTFOLIO_VIEWED: [
    'general',
    'wallet_intro_tour',
    'step_view_portfolio'
  ],
  WALLET_INTRO_REQUEST_VIEWED: [
    'general',
    'wallet_intro_tour',
    'step_view_request'
  ],
  WALLET_INTRO_SEND_VIEWED: ['general', 'wallet_intro_tour', 'step_view_send'],
  WALLET_INTRO_SWAP_VIEWED: ['general', 'wallet_intro_tour', 'step_view_swap'],
  WALLET_INTRO_BUYSELL_VIEWED: [
    'general',
    'wallet_intro_tour',
    'step_view_buysell'
  ]
}

export const ADS_EVENTS = {
  CLICK_AD: ['navigation', 'click_ad']
}

export const PIT_EVENTS = {
  BANNER_GET_STARTED: ['pit', 'homepage', 'homepage_banner_click'],
  SIDE_NAV: ['pit', 'sidenav', 'sidenav_link_click'],
  CONNECT_NOW: ['pit', 'link_page', 'connect_now_click'],
  LEARN_MORE: ['pit', 'link_page', 'learn_more_click']
}
