import { canTrade } from 'services/ExchangeService'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getCanBuy = (state) => {
  const settingsR = selectors.core.settings.getSettings(state)
  const optionsR = selectors.core.walletOptions.getOptions(state)
  const buySellR = selectors.core.kvStore.buySell.getMetadata(state)

  const transform = (settings, options, buySell) => canTrade('Buy', settings, options, buySell)
  return lift(transform)(settingsR, optionsR, buySellR)
}
