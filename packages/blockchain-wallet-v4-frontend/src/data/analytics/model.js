export const CUSTOM_DIMENSIONS = {
  CURRENCY_PREFERENCE: 1
}
// EVENTS
// format: [event_category, event_action, ?event_name, ?event_value]
export const ADDRESS_EVENTS = {
  ADD_NEXT_ADDRESS: ['addresses', 'add_next'],
  DELETE_LABEL: ['addresses', 'delete_label'],
  EDIT_LABEL: ['addresses', 'edit_label'],
  IMPORT: ['addresses', 'import'],
  SHOW_CHANGE: ['addresses', 'show_change'],
  SHOW_USED: ['addresses', 'show_used']
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
  }
}
// export const SECURITY_EVENTS = {
//   PASSWORD_CHANGE: ['security', '',]
// }
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
