import { lift } from 'ramda'

import { FiatType } from '@core/types'
import { selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'

export const getData = (state) => {
  const coins = selectors.components.swap.getCoins()
  const accounts = getCoinAccounts(state, { coins, ...SWAP_ACCOUNTS_SELECTOR })
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift((walletCurrency: FiatType) => ({
    accounts,
    coins,
    walletCurrency
  }))(walletCurrencyR)
}

export default getData
