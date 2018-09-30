export const MODAL_NAME = 'IdentityVerification'

export const STEPS = {
  personal: 'personal',
  mobile: 'mobile',
  verify: 'verify'
}

export const SMS_STEPS = {
  edit: 'edit',
  verify: 'verify'
}

export const PERSONAL_FORM = '@KYC.personalForm'
export const EMAIL_FORM = '@KYC.emailForm'
export const SMS_NUMBER_FORM = '@KYC.smsNumberForm'
export const ADDRESS_FORM = '@KYC.addresForm'

export const MANUAL_ADDRESS_ITEM = {
  value: {
    line1: '',
    line2: '',
    postCode: '',
    city: '',
    state: ''
  },
  text: 'manual address'
}

export const PHONE_EXISTS_ERROR = 'Phone number already registered'
export const BAD_CODE_ERROR = 'SMS Verification Code Incorrect.'
export const UPDATE_FAILURE = 'UPDATE_FAILURE'
