import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { add, traverse, reduce } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = state => createDeepEqualSelector(
  [
    selectors.core.kvStore.bch.getUnspendableContext
  ],
  (context) => {
    const getBalance = address => selectors.core.data.bch.getFinalBalance(address, state)
    const balancesR = traverse(Remote.of, getBalance, context)
    return balancesR.map(xs => reduce(add, 0, xs))
  }
)(state)
