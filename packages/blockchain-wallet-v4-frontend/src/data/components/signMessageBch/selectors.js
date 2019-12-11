import { path } from 'ramda'

export const getStep = path(['components', 'signMessageBch', 'step'])

export const getSignedMessage = path([
  'components',
  'signMessageBch',
  'signedMessage'
])
