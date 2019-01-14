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

export const TRACKING_ACTIONS = ['click', 'change', 'timing']
