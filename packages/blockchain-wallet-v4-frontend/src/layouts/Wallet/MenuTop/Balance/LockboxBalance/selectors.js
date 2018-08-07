import { add, lift, pathOr, reduce } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getLockboxBtcBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.lockbox.getLockboxBtcContext,
    selectors.core.data.bitcoin.getAddresses
  ],
  (lockboxBtcContextR, addressesR) => {
    const contextToBalances = (lockboxContext, balances) => {
      return lockboxContext.map(a => pathOr(0, [a, 'final_balance'], balances))
    }
    const balancesR = lift(contextToBalances)(lockboxBtcContextR, addressesR)
    return balancesR.map(reduce(add, 0))
  }
)

export const getLockboxEthBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.lockbox.getLockboxEthContext,
    selectors.core.data.ethereum.getAddresses
  ],
  (lockboxBtcContextR, addressesR) => {
    const contextToBalances = (lockboxContext, balances) => {
      return lockboxContext.map(a => pathOr(0, [a, 'balance'], balances))
    }
    const balancesR = lift(contextToBalances)(lockboxBtcContextR, addressesR)
    return balancesR.map(reduce(add, 0))
  }
)
