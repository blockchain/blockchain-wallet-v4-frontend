import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'
import { assoc, lift, unapply, reduce, concat } from 'ramda'
export const concatAll = unapply(reduce(concat, []))

const assocCoin = (txs, coin) => txs.map(assoc('coin', coin))

export const getData = createDeepEqualSelector(
  [
    selectors.core.common.btc.getWalletTransactions,
    selectors.core.common.bch.getWalletTransactions,
    selectors.core.common.eth.getWalletTransactions
  ],
  (btcTransactions, bchTransactions, ethTransactions) => {
    const transform = (btcTransactions, bchTransactions, ethTransactions) => {
      return concatAll(
        assocCoin(btcTransactions, 'BTC'),
        assocCoin(bchTransactions, 'BCH'),
        assocCoin(ethTransactions, 'ETH')
      )
    }
    return lift(transform)(
      ...concatAll(btcTransactions, bchTransactions, ethTransactions)
    )
  }
)
