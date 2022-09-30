import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const ratesR = selectors.core.data.misc.getRatesSelector(ownProps.coin, state)
  const fiatCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (fiatCurrency: ExtractSuccess<typeof fiatCurrencyR>, rates: ExtractSuccess<typeof ratesR>) => ({
      fiatCurrency,
      rates
    })
  )(fiatCurrencyR, ratesR)
}

export default getData
