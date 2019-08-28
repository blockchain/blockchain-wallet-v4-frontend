import { compose, prop, path } from 'ramda'
export const getCoinifyData = path(['components', 'coinify'])
export const getCoinifyBusy = compose(
  prop('coinifyBusy'),
  getCoinifyData
)
export const getCoinifySignupStep = compose(
  prop('signupStep'),
  getCoinifyData
)
export const getCoinifyPayment = compose(
  prop('payment'),
  getCoinifyData
)
export const getCoinifyCheckoutBusy = compose(
  prop('checkoutBusy'),
  getCoinifyData
)
export const getCoinifyMedium = compose(
  prop('medium'),
  getCoinifyData
)
export const getCoinifyCheckoutStep = compose(
  prop('checkoutStep'),
  getCoinifyData
)
export const getCoinifyCountry = compose(
  prop('country'),
  getCoinifyData
)
export const getCoinifyCheckoutError = compose(
  prop('checkoutError'),
  getCoinifyData
)
export const getCoinifyCancelTradeId = compose(
  prop('cancelTradeId'),
  getCoinifyData
)
