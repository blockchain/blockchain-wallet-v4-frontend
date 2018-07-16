import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const limits = selectors.core.data.coinify.getLimits(state)
  const quote = selectors.core.data.coinify.getQuote(state)
  const mediums = selectors.core.data.coinify.getMediums(state)

  return lift((limits, quote, mediums) => ({ limits, quote, mediums }))(limits, quote, mediums)
}
