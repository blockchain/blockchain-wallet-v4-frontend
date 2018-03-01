import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const verificationStatus = selectors.core.data.sfox.getVerificationStatus(state)
  return lift((verificationStatus) => ({ verificationStatus }))(verificationStatus)
}
