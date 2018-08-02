import { selectors } from 'data'
import { lift, pathOr } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.bitcoin.getAddresses,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.core.kvStore.lockbox.getLockboxBtcContext
  ],
  (addressesR, devicesR, lockboxBtcContextR) => {
    const transform = (balances, devices, lockbox) => {
      return {
        devices,
        balances: lockbox.map(a => pathOr(0, [a, 'final_balance'], balances))
      }
    }
    return lift(transform)(addressesR, devicesR, lockboxBtcContextR)
  }
)
