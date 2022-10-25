import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const interestRatesR = selectors.components.interest.getInterestRates(state)
  const afterTransactionR = selectors.components.interest.getAfterTransaction(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      interestRates: ExtractSuccess<typeof interestRatesR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>,
      walletCurrency: FiatType
    ) => ({
      afterTransaction,
      interestRates,
      walletCurrency
    })
  )(interestRatesR, afterTransactionR, walletCurrencyR)
}

export default getData
