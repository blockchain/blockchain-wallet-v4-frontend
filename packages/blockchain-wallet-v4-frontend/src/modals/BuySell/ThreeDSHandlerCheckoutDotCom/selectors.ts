import { lift } from 'ramda'

import { WalletOptionsType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const cardR = selectors.components.buySell.getBSCard(state)
  const providerDetailsR = selectors.components.buySell.getBSProviderDetails(state)
  const orderR = selectors.components.buySell.getBSOrder(state)
  const domains = selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains'])

  return lift((card, providerDetails, order) => ({
    card,
    domains,
    order,
    providerDetails
  }))(cardR, providerDetailsR, orderR)
}
