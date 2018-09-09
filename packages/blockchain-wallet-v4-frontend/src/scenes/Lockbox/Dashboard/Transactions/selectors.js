import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'
import {
  map,
  pathOr,
  curry,
  flatten,
  filter,
  assoc,
  lift,
  isEmpty,
  unapply,
  reduce,
  concat,
  last,
  dropLast,
  anyPass,
  compose,
  contains,
  toUpper,
  any,
  all,
  path
} from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
export const concatAll = unapply(reduce(concat, []))

const assocCoin = (txs, coin) => txs.map(assoc('coin', coin))

const filterTransactions = curry((searches, transactions) => {
  const search = curry((searches, property, tx) => {
    const checkSearch = text => {
      const containText = search => contains(toUpper(search), text)
      return isEmpty(searches) || any(containText, searches)
    }

    return compose(
      checkSearch,
      toUpper,
      String,
      path(property)
    )(tx)
  })
  const searchPredicate = anyPass(
    map(search(searches), [
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
  const pagesR = Remote.of(
    flatten(displayPages.map(page => page.getOrElse([])))
  )
  return {
    isLoading,
    pagesR
  }
}

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getCurrency,
    selectors.core.common.btc.getWalletTransactions,
    selectors.core.common.bch.getWalletTransactions,
    selectors.core.common.eth.getWalletTransactions,
    selectors.form.getFormValues('lockboxTransactions')
  ],
  (currencyR, btcPages, bchPages, ethPages, formValues) => {
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
    const isLoading = all(x => !!x, [btcIsLoading, bchIsLoading, ethIsLoading])
    const search = pathOr([], ['search', 'value'], formValues)
    const searches = search.map(path(['value']))
    const transform = (
      currency,
      btcTransactions,
      bchTransactions,
      ethTransactions
    ) => {
      const transactions = concatAll(
        btcTransactions,
        bchTransactions,
        ethTransactions
      )
      const filteredTransactions = filterTransactions(searches)(transactions)
      return {
        currency,
        isLoading,
        filteredTransactions
      }
    }
    return lift(transform)(
      currencyR,
      btcTransactions,
      bchTransactions,
      ethTransactions
    )
  }
)
