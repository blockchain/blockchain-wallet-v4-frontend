import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const profile = selectors.core.data.coinify.getProfile(state)
  const limits = selectors.core.data.coinify.getLimits(state)
  const level = selectors.core.data.coinify.getLevel(state)
  const mediums = selectors.core.data.coinify.getMediums(state)
  // const kycs = selectors.core.data.coinify.getKycs(state)
  const quote = selectors.core.data.coinify.getQuote(state)

  return lift((profile, limits, mediums, level, quote) => ({ profile, limits, mediums, level, quote }))(profile, limits, mediums, level, quote)
}

export const getMediums = (state) => {
  try {
    return selectors.core.data.coinify.getMediums(state)
  } catch (e) {
    return null
  }
}

export const getQuote = (state) => {
  try {
    return selectors.core.data.coinify.getQuote(state)
  } catch (e) {
    return null
  }
}
