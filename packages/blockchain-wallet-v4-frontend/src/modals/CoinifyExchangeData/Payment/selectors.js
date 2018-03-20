import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const profile = selectors.core.data.coinify.getProfile(state)
  const limits = selectors.core.data.coinify.getLimits(state)
  const level = selectors.core.data.coinify.getLevel(state)

  return lift((profile, limits, level) => ({ profile, limits, level }))(profile, limits, level)
}

export const getQuote = (state) => {
  try {
    return selectors.core.data.coinify.getQuote(state).data
  } catch (e) {
    return null
  }
}
