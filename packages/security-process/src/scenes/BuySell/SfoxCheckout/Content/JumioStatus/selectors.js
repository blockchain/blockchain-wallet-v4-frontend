import { lift, path } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const jumioTokenR = selectors.core.kvStore.buySell.getSfoxJumio(state)
  const jumioStatusR = path(['sfoxSignup', 'jumioStatus'])(state)
  const profileR = selectors.core.data.sfox.getProfile(state)

  const transform = (jumioStatus, jumioToken, profile) => {
    return {
      jumioStatus,
      jumioToken,
      profile
    }
  }

  return lift(transform)(jumioStatusR, jumioTokenR, profileR)
}
