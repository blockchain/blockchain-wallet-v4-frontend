import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const optionsR = selectors.core.walletOptions.getOptions(state)
  const buySellR = selectors.core.kvStore.buySell.getMetadata(state)

  const transform = lift((buySell, options) => ({ buySell, options }))
  return transform(buySellR, optionsR)
}
