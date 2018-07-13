import { length } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const canBuy = selectors.exchange.getCanTrade(state, 'Buy')
  return {
    btcAccountsLength: length(
      selectors.core.common.btc.getActiveHDAccounts(state).getOrElse([])
    ),
    partner: canBuy.getOrElse(false)
  }
}
