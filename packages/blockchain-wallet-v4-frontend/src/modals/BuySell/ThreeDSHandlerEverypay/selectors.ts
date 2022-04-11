import { lift } from 'ramda'

import { Remote } from '@core'
import { WalletOptionsType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const cardR = selectors.components.buySell.getBSCard(state)
  const providerDetailsR = selectors.components.buySell.getBSProviderDetails(state)
  const order = selectors.components.buySell.getBSOrder(state)
  const domains = selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains'])

  if (order) {
    return Remote.Success({
      domains,
      order,
      type: 'ORDER'
    })
  }

  const transform = (card, providerDetails) => ({
    card,
    domains,
    order,
    providerDetails,
    type: 'CARD'
  })

  return lift(transform)(cardR, providerDetailsR)
}
