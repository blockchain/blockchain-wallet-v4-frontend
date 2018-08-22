import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getSettingsOpened,
    selectors.exchange.getCanTrade
  ],
  (settingsOpened, canTradeR) => {
    const canTrade = canTradeR.getOrElse(false)

    return { settingsOpened, canTrade }
  }
)
