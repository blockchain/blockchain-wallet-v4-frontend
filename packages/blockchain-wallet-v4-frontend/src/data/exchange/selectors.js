import { canTrade } from 'services/ExchangeService'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getCanTrade = (state, type) => {
  const settingsR = selectors.core.settings.getSettings(state)
  const optionsR = selectors.core.walletOptions.getOptions(state)
  const buySellR = selectors.core.kvStore.buySell.getMetadata(state)

  const transform = (settings, options, buySell) =>
    canTrade(settings, options, buySell, type)
  return lift(transform)(settingsR, optionsR, buySellR)
}
