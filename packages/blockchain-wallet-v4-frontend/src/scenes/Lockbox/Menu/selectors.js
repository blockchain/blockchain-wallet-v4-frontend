import { selectors } from 'data'
import { lift, keysIn } from 'ramda'

export const getData = state => {
  const devicesKvStoreR = selectors.core.kvStore.lockbox.getDevices(state)
  const transform = devicesKvStore => {
    return devicesKvStore[keysIn(devicesKvStore)[0]]
  }
  return lift(transform)(devicesKvStoreR)
}
