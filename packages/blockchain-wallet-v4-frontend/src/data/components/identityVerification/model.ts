import { compose, includes, propOr } from 'ramda'
import { WalletFormType } from 'redux-form'

import { TIERS } from '../../modules/profile/model'

// order is important do not change it
export const STEPS = {
  infoAndResidential: 'infoAndResidential',
  moreInfo: 'moreInfo',
  // eslint-disable-next-line
  additionalInfo: 'additionalInfo',
  verify: 'verify',
  // eslint-disable-next-line
  submitted: 'submitted'
}

// order is important do not change it
export const STEP_TIERS = {
  infoAndResidential: TIERS[1],
  moreInfo: TIERS[2],
  // eslint-disable-next-line
  additionalInfo: TIERS[2],
  verify: TIERS[2],
  // eslint-disable-next-line
  submitted: TIERS[2]
}

export const SMS_STEPS = {
  edit: 'edit',
  verify: 'verify'
}

export const EMAIL_STEPS = {
  edit: 'edit',
  verify: 'verify'
}

export const PERSONAL_FORM = '@KYC.personalForm' as WalletFormType
export const VERIFY_EMAIL_FORM = '@KYC.verifyEmailForm' as WalletFormType
export const EMAIL_FORM = '@KYC.emailForm' as WalletFormType
export const SMS_NUMBER_FORM = '@KYC.smsNumberForm' as WalletFormType
export const ADDRESS_FORM = '@KYC.addresForm' as WalletFormType
export const ID_VERIFICATION_SUBMITTED_FORM = '@KYC.idVerificationSubmittedForm' as WalletFormType
export const INFO_AND_RESIDENTIAL_FORM = '@KYC.infoAndResidentialForm' as WalletFormType

export const PHONE_EXISTS_ERROR = 'Phone number already registered'
export const BAD_CODE_ERROR = 'SMS Verification Code Incorrect.'
export const UPDATE_FAILURE = 'UPDATE_FAILURE'

export const SUPPORTED_DOCUMENTS = {
  DRIVING_LICENCE: 'DRIVING_LICENCE',
  NATIONAL_IDENTITY_CARD: 'NATIONAL_IDENTITY_CARD',
  PASSPORT: 'PASSPORT'
}

export const isStateSupported = compose(includes('KYC'), propOr([], 'scopes'))

export const FLOW_TYPES = {
  HIGH: 'HIGH',
  LOW: 'LOW'
}

export const ERROR_TYPES = {
  55: 'INVALID_CAMPAIGN_USER',
  56: 'USER_ALREADY_REGISTERED_CAMPAIGN',
  57: 'CAMPAIGN_EXPIRED',
  58: 'INVALID_CAMPAIGN_INFO'
}

export const CAMPAIGNS = {
  sunriver: {
    coinCode: 'XLM',
    coinName: 'Stellar'
  }
}
