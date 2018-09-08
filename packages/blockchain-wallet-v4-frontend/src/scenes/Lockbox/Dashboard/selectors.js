import { selectors } from 'data'
import { lift } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.core.kvStore.lockbox.getDevices],
  devicesKvStoreR => {
    const transform = devicesKvStore => {
      // TODO: Multiple lockboxes
      const device = devicesKvStore[0]
      return device
    }
    return lift(transform)(devicesKvStoreR)
  }
)
