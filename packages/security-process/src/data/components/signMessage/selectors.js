import { path } from 'ramda'

export const getStep = path(['components', 'signMessage', 'step'])
export const getSignedMessage = path([
  'components',
  'signMessage',
  'signedMessage'
])
