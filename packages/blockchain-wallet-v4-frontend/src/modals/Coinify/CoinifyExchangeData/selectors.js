import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = state => {
  const profile = selectors.core.data.coinify.getProfile(state)

  return lift(profile => ({ profile }))(profile)
}
