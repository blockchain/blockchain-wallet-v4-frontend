import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getSettingsOpened,
    selectors.components.lockbox.getConnectionStatus,
    selectors.exchange.getCanTrade
  ],
  (settingsOpened, lockboxStatusR, canTradeR) => {
    const lockboxStatus = lockboxStatusR.getOrElse(null)
    const canTrade = canTradeR.getOrElse(false)

    console.info(lockboxStatus)
    return { settingsOpened, lockboxStatus, canTrade }
  }
)
