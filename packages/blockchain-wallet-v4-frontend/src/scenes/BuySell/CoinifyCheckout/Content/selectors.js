import { lift } from 'ramda'
// import settings from 'config'
import { selectors } from 'data'

export const getQuoteInputData = (state) => {
  const level = selectors.core.data.coinify.getLevel(state)
  return lift((level) => ({ level }))(level)
}
