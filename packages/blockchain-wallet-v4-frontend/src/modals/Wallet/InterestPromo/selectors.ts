import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const afterTransactionR = selectors.components.interest.getAfterTransaction(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      interestRate: ExtractSuccess<typeof interestRateR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>,
      walletCurrency: FiatType
    ) => ({
      afterTransaction,
      interestRate,
      walletCurrency
    })
  )(interestRateR, afterTransactionR, walletCurrencyR)
}

export default getData
