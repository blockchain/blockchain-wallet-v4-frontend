import { path } from 'ramda'

export const getStep = path(['components', 'sendXlm', 'step'])
export const getPayment = path(['components', 'sendXlm', 'payment'])
export const getCheckDestination = path([
  'components',
  'sendXlm',
  'checkDestination'
])
export const getIsDestinationExchange = path([
  'components',
  'sendXlm',
  'isDestinationExchange'
])
export const getFeeToggled = path(['components', 'sendXlm', 'feeToggled'])
export const showNoAccountForm = path([
  'components',
  'sendXlm',
  'showNoAccountForm'
])
