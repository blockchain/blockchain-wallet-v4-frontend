import { lift } from 'ramda'
// import{ getFormValues } from 'redux-form'

import { FiatType, SupportedWalletCurrenciesType } from 'core/types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const supportedCoins = supportedCoinsR.getOrElse(
    {} as SupportedWalletCurrenciesType
  )
  // const formValues = getFormValues('brokerageTx')(state)

  return lift((walletCurrency: FiatType) => ({
    walletCurrency,
    supportedCoins,
    // TODO find a way to grab this
    amount: 0,
    completeDate: 'January 28, 2021'
  }))(walletCurrencyR)
}
