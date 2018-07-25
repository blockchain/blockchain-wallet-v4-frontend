import { path, compose, prop } from 'ramda'

export const getUserData = path(['profile', 'userData'])
export const getUserActivationState = compose(
  prop('state'),
  getUserData
)
export const getUserKYCState = compose(
  prop('kycState'),
  getUserData
)
