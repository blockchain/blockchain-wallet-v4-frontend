import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const quoteR = selectors.components.buySell.getBuyQuote(state)

  return lift((quote: ExtractSuccess<typeof quoteR>) => ({
    quote
  }))(quoteR)
}
