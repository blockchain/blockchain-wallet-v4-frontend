import { path } from 'ramda'

export const getVerificationStep = path([
  'components',
  'identityVerification',
  'verificationStep'
])
export const getSmsStep = path([
  'components',
  'identityVerification',
  'smsStep'
])

export const getSupportedCountries = path([
  'components',
  'identityVerification',
  'supportedCountries'
])

export const getSupportedDocuments = path([
  'components',
  'identityVerification',
  'supportedDocuments'
])

export const getStates = path(['components', 'identityVerification', 'states'])

export const getKycFLowType = path([
  'components',
  'identityVerification',
  'flowType'
])
