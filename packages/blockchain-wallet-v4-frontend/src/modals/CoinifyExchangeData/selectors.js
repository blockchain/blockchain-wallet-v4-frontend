import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state) => {
  const profile = selectors.core.data.coinify.getProfile(state)
  // const accounts = selectors.core.data.coinify.getAccounts(state)
  // const verificationStatus = selectors.core.data.coinify.getVerificationStatus(state).data

  return lift((profile) => ({ profile }))(profile)
}
