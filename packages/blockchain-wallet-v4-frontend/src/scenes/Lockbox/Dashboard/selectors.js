import { selectors } from 'data'
import { lift, keysIn } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.core.kvStore.lockbox.getDevices],
  devicesKvStoreR => {
    const transform = devicesKvStore => {
      return devicesKvStore[keysIn(devicesKvStore)[0]]
    }
    return lift(transform)(devicesKvStoreR)
  }
)
