import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const profile = selectors.core.data.sfox.getProfile(state)
  const verificationStatus = selectors.core.data.sfox.getVerificationStatus(state).data
  return lift((profile) => ({ profile, verificationStatus }))(profile)
}

export const getQuote = (state) => {
  try {
    return selectors.core.data.sfox.getQuote(state).data
  } catch (e) {
    return null
  }
}

export const getBase = (state) => {
  return state.form.exchangeCheckout && state.form.exchangeCheckout.active
}
