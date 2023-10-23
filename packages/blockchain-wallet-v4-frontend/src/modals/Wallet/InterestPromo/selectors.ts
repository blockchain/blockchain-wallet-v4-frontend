import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const interestRatesR = selectors.components.interest.getInterestRates(state)
  const afterTransactionR = selectors.components.interest.getAfterTransaction(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const productAuthMetadata = selectors.auth.getProductAuthMetadata(state)

  return lift(
    (
      interestRates: ExtractSuccess<typeof interestRatesR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>,
      walletCurrency: FiatType,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      afterTransaction,
      interestRates,
      productAuthMetadata,
      userData,
      walletCurrency
    })
  )(interestRatesR, afterTransactionR, walletCurrencyR, userDataR)
}

export default getData
