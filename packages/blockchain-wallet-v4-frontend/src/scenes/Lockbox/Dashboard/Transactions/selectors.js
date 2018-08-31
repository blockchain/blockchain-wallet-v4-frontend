import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'
import {
  map,
  curry,
  flatten,
  filter,
  assoc,
  lift,
  unapply,
  reduce,
  concat,
  last,
  dropLast,
  anyPass,
  compose,
  contains,
  toUpper,
  path
} from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
export const concatAll = unapply(reduce(concat, []))

const assocCoin = (txs, coin) => txs.map(assoc('coin', coin))

const filterTransactions = curry((searchVals, transactions) => {
  const search = curry((text, property, tx) => {
    
    return compose(
      contains(toUpper(text || '')),
      toUpper,
      String,
      path(property)
    )(tx)
  })
  const searchPredicate = anyPass(
    map(search(searchVals), [
      ['description'],
      ['from'],
      ['to'],
      ['coin'],
      ['hash'],
      ['outputs', 0, 'address'],
      ['inputs', 0, 'address']
    ])
  )
  return filter(searchPredicate, transactions)
})

const processPages = (pages, coinType) => {
  const ProcessTxs = txList => assocCoin(txList, coinType)
  const ProcessPage = lift(ProcessTxs)
  const allPages = map(ProcessPage, pages)
  const isLoading = Remote.Loading.is(last(allPages))
  const displayPages = isLoading ? dropLast(1, allPages) : allPages
  return Remote.of(flatten(displayPages.map(page => page.getOrElse([]))))
}

export const getData = createDeepEqualSelector(
  [
    selectors.core.common.btc.getWalletTransactions,
    selectors.core.common.bch.getWalletTransactions,
    selectors.core.common.eth.getWalletTransactions,
    selectors.form.getFormValues('lockboxTransactions')
  ],
  (btcPages, bchPages, ethPages, search) => {
    const btcTransactions = processPages(btcPages, 'BTC')
    const bchTransactions = processPages(bchPages, 'BCH')
    const ethTransactions = processPages(ethPages, 'ETH')
    const transform = (btcTransactions, bchTransactions, ethTransactions) => {
      return concatAll(btcTransactions, bchTransactions, ethTransactions).map(
        filterTransactions(search)
      )
    }
    return lift(transform)(btcTransactions, bchTransactions, ethTransactions)
  }
)
