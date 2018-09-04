import { selectors } from 'data'
import { lift, keysIn } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import {
  getLockboxBtcBalance,
  getLockboxBchBalance,
  getLockboxEthBalance
} from 'components/Balances/lockbox/selectors'

export const getData = createDeepEqualSelector(
  [
    selectors.core.kvStore.lockbox.getDevices,
    getLockboxBtcBalance,
    getLockboxBchBalance,
    getLockboxEthBalance
  ],
  (devicesKvStoreR, btcBalanceR, bchBalanceR, ethBalanceR) => {
    const transform = devicesKvStore => {
      const deviceInfo = devicesKvStore[keysIn(devicesKvStore)[0]]
      if (deviceInfo) deviceInfo.id = keysIn(devicesKvStore)[0]

      return {
        deviceInfo,
        btcBalance: btcBalanceR.getOrElse(0),
        bchBalance: bchBalanceR.getOrElse(0),
        ethBalance: ethBalanceR.getOrElse(0)
      }
    }
    return lift(transform)(devicesKvStoreR)
  }
)

export const getFormValues = selectors.form.getFormValues('lockboxTransactions')
