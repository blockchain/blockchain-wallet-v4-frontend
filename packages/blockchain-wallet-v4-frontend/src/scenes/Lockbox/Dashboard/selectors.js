import { selectors } from 'data'
import { lift, keysIn } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.core.kvStore.lockbox.getDevices],
  devicesKvStoreR => {
    const transform = devicesKvStore => {
      const deviceInfo = devicesKvStore[keysIn(devicesKvStore)[0]]
      if (deviceInfo) deviceInfo.id = keysIn(devicesKvStore)[0]

      return deviceInfo
    }
    return lift(transform)(devicesKvStoreR)
  }
)
