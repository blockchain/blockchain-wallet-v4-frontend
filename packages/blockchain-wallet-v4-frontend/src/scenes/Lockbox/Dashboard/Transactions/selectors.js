import {
  any,
  anyPass,
  assoc,
  compose,
  concat,
  contains,
  curry,
  dropLast,
  filter,
  flatten,
  isEmpty,
  last,
  lift,
  map,
  path,
  pathOr,
  reduce,
  toUpper,
  unapply
} from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'
export const concatAll = unapply(reduce(concat, []))

const assocCoin = (txs, coin) => txs.map(assoc('coin', coin))

const filterTransactions = curry((searches, transactions) => {
  const search = curry((searches, property, tx) => {
    const checkSearch = text => {
      const containText = search => contains(toUpper(search), text)
      return isEmpty(searches) || any(containText, searches)
    }

    return compose(checkSearch, toUpper, String, path(property))(tx)
  })
  const searchPredicate = anyPass(
    map(search(searches), [
      ['description'],
      ['from'],
      ['to'],
      ['coin'],
      ['hash'],
      ['type'],
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
  const pagesR = Remote.of(
    flatten(displayPages.map(page => page.getOrElse([])))
  )
  return {
    isLoading,
    pagesR
  }
}

const getTransactionsAtBounds = state => {
  const bchAtBounds = selectors.core.data.bch.getTransactionsAtBound(state)
  const xlmAtBounds = selectors.core.data.xlm.getTransactionsAtBound(state)
  const btcAtBounds = selectors.core.data.btc.getTransactionsAtBound(state)
  const ethAtBounds = selectors.core.data.eth.getTransactionsAtBound(state)
  return bchAtBounds && btcAtBounds && ethAtBounds && xlmAtBounds
}

export const getData = createDeepEqualSelector(
  [
    getTransactionsAtBounds,
    selectors.core.settings.getCurrency,
    selectors.core.common.btc.getWalletTransactions,
    selectors.core.common.bch.getWalletTransactions,
    selectors.core.common.eth.getWalletTransactions,
    selectors.core.common.xlm.getWalletTransactions,
    selectors.form.getFormValues('lockboxTransactions')
  ],
  (
    transactionsAtBounds,
    currencyR,
    btcPages,
    bchPages,
    ethPages,
    xlmPages,
    formValues
  ) => {
    const { isLoading: btcIsLoading, pagesR: btcTransactions } = processPages(
      btcPages,
      'BTC'
    )
    const { isLoading: bchIsLoading, pagesR: bchTransactions } = processPages(
      bchPages,
      'BCH'
    )
    const { isLoading: ethIsLoading, pagesR: ethTransactions } = processPages(
      ethPages,
      'ETH'
    )
    const { isLoading: xlmIsLoading, pagesR: xlmTransactions } = processPages(
      xlmPages,
      'XLM'
    )
    const isLoading = any(x => !!x, [
      btcIsLoading,
      bchIsLoading,
      ethIsLoading,
      xlmIsLoading
    ])
    const search = pathOr([], ['search', 'value'], formValues)
    const searchesApplied = search.map(path(['value']))
    const transform = (
      currency,
      btcTransactions,
      bchTransactions,
      ethTransactions,
      xlmTransactions
    ) => {
      const transactions = concatAll(
        btcTransactions,
        bchTransactions,
        ethTransactions,
        xlmTransactions
      )
      const filteredTransactions = filterTransactions(searchesApplied)(
        transactions
      )
      return {
        currency,
        isLoading,
        searchesApplied,
        filteredTransactions,
        transactionsAtBounds
      }
    }
    return lift(transform)(
      currencyR,
      btcTransactions,
      bchTransactions,
      ethTransactions,
      xlmTransactions
    )
  }
)
