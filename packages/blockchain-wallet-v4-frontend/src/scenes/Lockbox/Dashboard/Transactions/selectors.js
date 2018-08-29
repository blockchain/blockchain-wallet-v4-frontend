import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'
import { lift, unapply, reduce, concat } from 'ramda'
export const concatAll = unapply(reduce(concat, []))

export const getData = createDeepEqualSelector(
  [
    selectors.core.common.btc.getWalletTransactions,
    selectors.core.common.bch.getWalletTransactions,
    selectors.core.common.eth.getWalletTransactions
  ],
  (btcTransactions, bchTransactions, ethTransactions) => {
    const transform = (btcTransactions, bchTransactions, ethTransactions) => {
      return concatAll(btcTransactions, bchTransactions, ethTransactions)
    }
    return lift(transform)(
      ...concatAll(btcTransactions, bchTransactions, ethTransactions)
    )
  }
)
