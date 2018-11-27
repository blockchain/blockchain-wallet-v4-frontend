import { compose, prop } from 'ramda'
export const getCoinifyData = prop('coinify')
export const getCoinifyBusy = compose(prop('coinifyBusy'), getCoinifyData)
export const getCoinifySignupStep = compose(prop('signupStep'), getCoinifyData)
export const getCoinifyPayment = compose(prop('payment'), getCoinifyData)
