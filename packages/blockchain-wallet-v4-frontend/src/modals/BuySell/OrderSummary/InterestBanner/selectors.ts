import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const interestRatesR = selectors.components.interest.getInterestRates(state)
  const afterTransactionR = selectors.components.interest.getAfterTransaction(state)

  return lift(
    (
      interestRates: ExtractSuccess<typeof interestRatesR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>
    ) => ({
      afterTransaction,
      interestRates
    })
  )(interestRatesR, afterTransactionR)
}

export default getData
