import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { InitSwapFormValuesType } from 'data/types'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const initSwapFormValues = selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType
  const limitsR = selectors.components.swap.getLimits(state)
  const ratesR = selectors.core.data.misc.getRatesSelector(
    initSwapFormValues?.BASE?.coin || 'BTC',
    state
  )
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  return lift(
    (
      limits: ExtractSuccess<typeof limitsR>,
      rates: ExtractSuccess<typeof ratesR>,
      walletCurrency: ExtractSuccess<typeof walletCurrencyR>
    ) => ({
      limits,
      rates,
      walletCurrency
    })
  )(limitsR, ratesR, walletCurrencyR)
}
