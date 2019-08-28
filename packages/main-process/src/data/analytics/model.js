export const CUSTOM_DIMENSIONS = {
  CURRENCY_PREFERENCE: 1
}
//
// EVENTS
// format: [event_category, event_action, ?event_name, ?event_value]
//
export const ADDRESS_EVENTS = {
  ADD_NEXT_ADDR: ['addresses', 'add_next_addr'],
  DELETE_LABEL: ['addresses', 'delete_label'],
  EDIT_LABEL: ['addresses', 'edit_label'],
  HIDE_USED_ADDRS: ['addresses', 'hide_used'],
  IMPORT_ADDR: ['addresses', 'import'],
  SHOW_CHANGE_ADDRS: ['addresses', 'show_change_addrs'],
  SHOW_USED_ADDRS: ['addresses', 'show_used_addrs']
}
export const LOGIN_EVENTS = {
  TRANSFER_ETH_LEGACY: ['login', 'transfer_eth_legacy']
}
export const KYC_EVENTS = {
  FORMS: {
    PERSONAL: ['kyc', 'personal_form'],
    UPDATE_PHONE_NUMBER: ['kyc', 'personal_form', 'mobile']
  },
  ONBOARDING_START: ['kyc', 'onboarding', 'kyc_onboarding_start'],
  SELECT_TIER: ['kyc', 'onboarding', 'select_tier'],
  STEP_CHANGE: ['kyc', 'onboarding', 'kyc_onboarding_step_to_'],
  SEND_VERIFICATION_EMAIL: ['kyc', 'onboarding', 'send_verification_email'],
  SEND_SMS_CODE: ['kyc', 'onboarding', 'send_sms_code'],
  VERIFY_PHONE_SUCCESS: ['kyc', 'onboarding', 'verify_phone_number_success'],
  VERIFY_PHONE_FAILURE: ['kyc', 'onboarding', 'verify_phone_number_failure']
}
export const LOCKBOX_EVENTS = {
  INSTALL_APP: ['lockbox', 'apps', 'install'],
  UNINSTALL_APP: ['lockbox', 'apps', 'uninstall'],
  SETTINGS: {
    ADD_DEVICE: ['lockbox', 'settings', 'add_device'],
    FIRMWARE_UPDATE: ['lockbox', 'settings', 'firmware_update'],
    RENAME_DEVICE: ['lockbox', 'settings', 'rename_device'],
    REMOVE_DEVICE: ['lockbox', 'settings', 'remove_device'],
    SHOW_XPUBS: ['lockbox', 'settings', 'show_xpubs'],
    TAKE_TOUR: ['lockbox', 'settings', 'take_tour']
  },
  DEVICE_SETUP: {
    SELECT_DEVICE: ['lockbox', 'device_setup', 'lockbox_setup_start'],
    SETUP_TYPE: ['lockbox', 'device_setup', 'lockbox_setup_type'],
    CONNECT_DEVICE: ['lockbox', 'device_setup', 'lockbox_setup_connect'],
    INSTALL_APPS: [
      'lockbox',
      'device_setup',
      'lockbox_setup_connect_install_apps'
    ],
    PAIR_DEVICE: ['lockbox', 'device_setup', 'lockbox_setup_pair_device'],
    COMPLETE: ['lockbox', 'device_setup', 'lockbox_setup_complete'],
    VIEW_TOUR: ['lockbox', 'device_setup', 'view_tour']
  }
}
export const PREFERENCE_EVENTS = {
  GENERAL: {
    AUTO_LOGOUT: ['preferences', 'general', 'auto_logout'],
    CHANGE_CURRENCY: ['preferences', 'general', 'currency'],
    CHANGE_LANGUAGE: ['preferences', 'general', 'language'],
    CHANGE_THEME: ['preferences', 'general', 'theme'],
    ENABLE_BTC_LINKS: ['preferences', 'general', 'enable_btc_links'],
    SHOW_PAIRING_CODE: ['preferences', 'general', 'show_pairing_code']
  },
  SECURITY: {
    ACTIVITY_LOGGING: ['preferences', 'security', 'activity_logging'],
    BACKUP_PHRASE_VERIFIED: [
      'preferences',
      'security',
      'backup_phrase_verified'
    ],
    EMAIL_VERIFIED: ['preferences', 'security', 'email_verified'],
    PASSWORD_CHANGE: ['preferences', 'security', 'password_change'],
    PASSWORD_STRETCHING: ['preferences', 'security', 'password_stretching'],
    IP_WHITELIST_EDIT: ['preferences', 'security', 'edit_ip_whitelist'],
    IP_RESTRICTIONS: ['preferences', 'security', 'ip_restrictions'],
    TWO_FACTOR_ENABLED: ['preferences', 'security', '2fa_enabled'],
    TWO_FACTOR_DISABLED: ['preferences', 'security', '2fa_disabled'],
    TOR_ACCESS: ['preferences', 'security', 'tor_access']
  }
}
export const SUNRIVER_AIRDROP_EVENTS = {
  SOCIAL_SHARE: ['sunriver', 'airdrop', 'social_share']
}
export const SWAP_EVENTS = {
  ORDER_CONFIRM: ['swap', 'order_form', 'order_confirm'],
  ORDER_CONFIRM_ERROR: ['swap', 'order_form', 'order_confirm_error'],
  ORDER_PREVIEW: ['swap', 'order_form', 'order_preview'],
  ORDER_PREVIEW_ERROR: ['swap', 'order_form', 'order_preview_error'],
  REVERSE_PAIR: ['swap', 'order_form', 'reverse_pair'],
  SUBMIT_SWAP: ['swap', 'order_form', 'submit_swap'],
  FIAT_TO_CRYPTO_CHANGE: ['swap', 'order_form', 'fiat_to_crypto_change'],
  CRYPTO_TO_FIAT_CHANGE: ['swap', 'order_form', 'crypto_to_fiat_change'],
  EXCHANGE_RECEIVE_CHANGE: ['swap', 'order_form', 'exchange_receive_change'],
  VALUE_INPUT: ['swap', 'order_form', 'value_input'],
  USE_MIN: ['swap', 'order_form', 'use_min'],
  USE_MAX: ['swap', 'order_form', 'use_max'],
  VIEW_ORDER_DETAILS: ['swap', 'order_history', 'view_details']
}
export const TRANSACTION_EVENTS = {
  SEND: ['transactions', 'send'],
  REQUEST: ['transactions', 'request'],
  EDIT_DESCRIPTION: ['transactions', 'edit_description'],
  PAYMENT_REQUEST: ['transactions', 'payment_request'],
  SEND_FAILURE: ['send_failure'],
  VIEW_TX_ON_EXPLORER: ['transactions', 'view_tx_explorer']
}
export const WALLET_EVENTS = {
  ADD_NEW: ['wallets', 'add_new'],
  ARCHIVE: ['wallets', 'archive'],
  CHANGE_DEFAULT: ['wallets', 'change_default'],
  EDIT_NAME: ['wallets', 'edit_name'],
  SHOW_XPUB: ['wallets', 'show_xpub'],
  UNARCHIVE: ['wallets', 'unarchive']
}

export const AB_TESTS = {
  MIN_MAX_EXCHANGE: 'MinMaxExchange',
  SWAP_OR_TRADE_TEST: 'SwapOrTradeTest'
}

export const GENERAL_EVENTS = {
  VIEW_WHATS_NEW: ['general', 'view_whats_new'],
  VIEW_FAQ: ['general', 'view_faq']
}

export const ADS_EVENTS = {
  CLICK_AD: ['navigation', 'click_ad']
}
