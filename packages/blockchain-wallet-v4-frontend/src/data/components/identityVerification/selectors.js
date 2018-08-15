import { path } from 'ramda'

export const getStep = path(['components', 'identityVerification', 'step'])
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

export const getPossibleAddresses = path([
  'components',
  'identityVerification',
  'possibleAddresses'
])

export const isAddressRefetchVisible = path([
  'components',
  'identityVerification',
  'addressRefetchVisible'
])
