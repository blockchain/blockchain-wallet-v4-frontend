import { keysIn } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getSettingsOpened,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.exchange.getCanTrade
  ],
  (settingsOpened, lockboxDevicesR, canTradeR) => {
    const devicesStored = !!keysIn(lockboxDevicesR.getOrElse({})).length
    const canTrade = canTradeR.getOrElse(false)

    return { settingsOpened, devicesStored, canTrade }
  }
)
