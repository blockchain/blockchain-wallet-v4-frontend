import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const interestRatesR = selectors.components.interest.getInterestRates(state)
  const afterTransactionR = selectors.components.interest.getAfterTransaction(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift(
    (
      interestRates: ExtractSuccess<typeof interestRatesR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      afterTransaction,
      interestRates,
      userData
    })
  )(interestRatesR, afterTransactionR, userDataR)
}

export default getData
