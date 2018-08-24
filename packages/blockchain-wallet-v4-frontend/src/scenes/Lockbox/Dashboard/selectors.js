import { selectors } from 'data'
import { lift, pathOr } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = () => {
  return {
    name: 'yo',
    accounts: {}
  }
}
// export const getData = createDeepEqualSelector(
//   [
//     selectors.components.lockbox.getConnectedDevice,
//     selectors.core.kvStore.lockbox.getDevices
//   ],
//   (connectedDeviceR, devicesKvStoreR) => {
//     const transform = (connectedDevice, devicesKvStore) => {
//       return {
//         name: 'yo',
//         accounts: {}
//       }
//     }
//     return lift(transform)(connectedDeviceR, devicesKvStoreR)
//   }
// )
