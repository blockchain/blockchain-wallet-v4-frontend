import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const ratesR = selectors.core.data.misc.getRatesSelector(ownProps.coin, state)
  const fiatCurrency = selectors.components.buySell.getFiatCurrency(state)

  return lift((rates: ExtractSuccess<typeof ratesR>) => ({
    fiatCurrency,
    rates
  }))(ratesR)
}

export default getData
