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

export const TRANSACTION_EVENTS = {
  SEND: ['transactions', 'send'],
  REQUEST: ['transactions', 'request'],
  EDIT_DESCRIPTION: ['transactions', 'edit_description']
}

export const EXCHANGE = {
  ENTERED: ['exchange', 'checkout', 'entered'],
  FIRST_STEP_SUBMIT: ['exchange', 'checkout', 'first_step_submit'],
  SECOND_STEP_BACK: ['exchange', 'checkout', 'second_step_back'],
  SECOND_STEP_SUBMIT_CLICK: [
    'exchange',
    'checkout',
    'second_step_submit_click'
  ],
  SECOND_STEP_SUBMIT: ['exchange', 'checkout', 'second_step_submit'],
  SECOND_STEP_ERROR: ['exchange', 'checkout', 'second_step_error']
}
export const KYC = {
  EMAIL_EXISTS: ['kyc', 'onboard', 'email_exists'],
  STARTED: ['kyc', 'onboard', 'started_kyc_flow'],
  REENTERED: ['kyc', 'onboard', 'reentered_kyc_flow'],
  PERSONAL_STEP_COMPLETE: ['kyc', 'onboard', 'personal_step_complete_kyc_flow'],
  MOBILE_STEP_COMPLETE: ['kyc', 'onboard', 'mobile_step_complete_kyc_flow'],
  ONFIDO_STARTED: ['kyc', 'onboard', 'onfido_started'],
  COMPLETE: ['kyc', 'onboard', 'complete_kyc_flow']
}
