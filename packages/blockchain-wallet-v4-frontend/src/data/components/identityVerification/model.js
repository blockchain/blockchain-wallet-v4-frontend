import { compose, includes, propOr } from 'ramda'

import { TIERS } from '../../modules/profile/model'

export const KYC_MODAL = 'KYC_MODAL'

export const STEPS = {
  infoAndResidential: 'infoAndResidential',
  moreInfo: 'moreInfo',
  additionalInfo: 'additionalInfo',
  verify: 'verify',
  submitted: 'submitted'
}

export const STEP_TIERS = {
  infoAndResidential: TIERS[1],
  moreInfo: TIERS[2],
  additionalInfo: TIERS[2],
  verify: TIERS[2],
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

export const PERSONAL_FORM = '@KYC.personalForm'
export const VERIFY_EMAIL_FORM = '@KYC.verifyEmailForm'
export const EMAIL_FORM = '@KYC.emailForm'
export const SMS_NUMBER_FORM = '@KYC.smsNumberForm'
export const ADDRESS_FORM = '@KYC.addresForm'
export const ID_VERIFICATION_SUBMITTED_FORM = '@KYC.idVerificationSubmittedForm'
export const INFO_AND_RESIDENTIAL_FORM = '@KYC.infoAndResidentialForm'

export const PHONE_EXISTS_ERROR = 'Phone number already registered'
export const BAD_CODE_ERROR = 'SMS Verification Code Incorrect.'
export const UPDATE_FAILURE = 'UPDATE_FAILURE'

export const SUPPORTED_DOCUMENTS = {
  PASSPORT: 'PASSPORT',
  DRIVING_LICENCE: 'DRIVING_LICENCE',
  NATIONAL_IDENTITY_CARD: 'NATIONAL_IDENTITY_CARD'
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
