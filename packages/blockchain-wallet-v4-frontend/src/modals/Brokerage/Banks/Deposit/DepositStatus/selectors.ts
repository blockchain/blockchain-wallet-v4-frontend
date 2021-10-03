import { lift } from 'ramda'

import { FiatType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift((walletCurrency: FiatType) => ({
    // TODO find a way to grab this
    amount: 0,

    completeDate: 'TODO',
    walletCurrency
  }))(walletCurrencyR)
}

export default getData
