import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const afterTransactionR = selectors.components.interest.getAfterTransaction(state)

  return lift(
    (
      interestRate: ExtractSuccess<typeof interestRateR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>
    ) => ({
      afterTransaction,
      interestRate
    })
  )(interestRateR, afterTransactionR)
}

export default getData
