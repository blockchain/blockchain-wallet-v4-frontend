import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state) => {
  const profile = selectors.core.data.sfox.getProfile(state)
  const accounts = selectors.core.data.sfox.getAccounts(state)
  const verificationStatus = selectors.core.data.sfox.getVerificationStatus(state).data

  return lift((profile, accounts) => ({ profile, accounts, verificationStatus }))(profile, accounts)
}
