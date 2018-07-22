import { lift, path } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const jumioStatusR = path(['sfoxSignup', 'jumioStatus'])(state)
  const profileR = selectors.core.data.sfox.getProfile(state)

  const transform = (jumioStatus, profile) => {
    return {
      jumioStatus,
      profile
    }
  }

  return lift(transform)(jumioStatusR, profileR)
}
