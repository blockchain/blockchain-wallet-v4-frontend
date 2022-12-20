import { compose, includes, propOr } from 'ramda'
import { WalletFormType } from 'redux-form'

import { TIERS } from '../../modules/profile/model'
import { StepsEnum } from './types'

/* eslint-disable */
// order is important do not change it
export const STEPS = {
  userDetails: StepsEnum.userDetails,
  userAddress: StepsEnum.userAddress,
  moreInfo: StepsEnum.moreInfo,
  addExtraStep: StepsEnum.addExtraStep,
  additionalInfo: StepsEnum.additionalInfo,
  verify: StepsEnum.verify,
  submitted: StepsEnum.submitted
}

// order is important do not change it
export const STEP_TIERS = {
  userDetails: TIERS[1],
  userAddress: TIERS[1],
  moreInfo: TIERS[2],
  addExtraStep: TIERS[2],
  additionalInfo: TIERS[2],
  verify: TIERS[2],
  submitted: TIERS[2]
}
/* eslint-enable */

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
export const USER_INFO_DETAILS = '@KYC.userInfoDetails' as WalletFormType
export const RESIDENTIAL_FORM = '@KYC.ResidentialForm' as WalletFormType
export const KYC_EXTRA_QUESTIONS_FORM = '@KYC.kycExtraQuestionsForm' as WalletFormType

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
