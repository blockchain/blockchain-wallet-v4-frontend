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
export const LOCKBOX_EVENTS = {
  INSTALL_APP: ['lockbox', 'apps', 'install'],
  UNINSTALL_APP: ['lockbox', 'apps', 'uninstall'],
  SETTINGS: {
    ADD_DEVICE: ['lockbox', 'settings', 'add_device'],
    AUTHENTICATE_DEVICE: ['lockbox', 'settings', 'check_authenticity'],
    FIRMWARE_UPDATE: ['lockbox', 'settings', 'firmware_update'],
    RENAME_DEVICE: ['lockbox', 'settings', 'rename_device'],
    REMOVE_DEVICE: ['lockbox', 'settings', 'remove_device'],
    SHOW_XPUBS: ['lockbox', 'settings', 'show_xpubs'],
    TAKE_TOUR: ['lockbox', 'settings', 'take_tour']
  },
  DEVICE_SETUP: {
    SELECT_DEVICE: ['lockbox', 'device_setup', 'select_device'],
    SETUP_TYPE: ['lockbox', 'device_setup', 'setup_type'],
    CONNECT_DEVICE: ['lockbox', 'device_setup', 'connect_device'],
    INSTALL_APPS: ['lockbox', 'device_setup', 'install_apps'],
    PAIR_DEVICE: ['lockbox', 'device_setup', 'pair_device'],
    COMPLETE: ['lockbox', 'device_setup', 'complete'],
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
export const TRANSACTION_EVENTS = {
  SEND: ['transactions', 'send'],
  REQUEST: ['transactions', 'request'],
  EDIT_DESCRIPTION: ['transactions', 'edit_description']
}
export const WALLET_EVENTS = {
  ADD_NEW: ['wallets', 'add_new'],
  ARCHIVE: ['wallets', 'archive'],
  CHANGE_DEFAULT: ['wallets', 'change_default'],
  EDIT_NAME: ['wallets', 'edit_name'],
  SHOW_XPUB: ['wallets', 'show_xpub'],
  UNARCHIVE: ['wallets', 'unarchive']
}
export const SWAP_EVENTS = {
  ORDER_FORM: {
    ORDER_CANCEL: ['swap', 'order_form', 'order_cancel'],
    ORDER_CONFIRM: ['swap', 'order_form', 'order_confirm'],
    ORDER_PREVIEW: ['swap', 'order_form', 'order_preview'],
    REVERSE_INPUT: ['swap', 'order_form', 'reverse_input'], // TYPE COIN or FIAT
    REVERSE_SWAP: ['swap', 'order_form', 'reverse_swap'],
    SUBMIT_SWAP: ['swap', 'order_form', 'submit_swap'],
    TOGGLE_FIXED: ['swap', 'order_form', 'toggle_fixed'], // TYPE Receive or Swap
    USE_MIN: ['swap', 'order_form', 'use_min'],
    USE_MAX: ['swap', 'order_form', 'use_max']
  },
  ORDER_HISTORY: {
    VIEW_ORDER_DETAILS: ['swap', 'order_history', 'view_details']
  }
}
