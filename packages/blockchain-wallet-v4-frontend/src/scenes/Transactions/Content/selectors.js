import { createSelector } from 'reselect'
import { selectors, model } from 'data'
import {
  all,
  curry,
  isEmpty,
  propSatisfies,
  toUpper,
  prop,
  allPass,
  anyPass,
  compose,
  includes,
  map,
  filter,
  path,
  propOr
} from 'ramda'
import { hasAccount } from 'services/ExchangeService'

const { WALLET_TX_SEARCH } = model.form

const filterTransactions = curry((status, criteria, transactions) => {
  const isOfType = curry((filter, tx) =>
    propSatisfies(
      x => filter === '' || toUpper(x) === toUpper(filter),
      'type',
      tx
    )
  )
  const search = curry((text, txPath, tx) =>
    compose(
      includes(toUpper(text || '')),
      toUpper,
      String,
      path(txPath)
    )(tx)
  )
  const searchPredicate = anyPass(
    map(search(criteria), [
      ['description'],
      ['from'],
      ['to'],
      ['hash'],
      ['outputs', 0, 'address'],
      ['inputs', 0, 'address']
    ])
  )
  const fullPredicate = allPass([isOfType(status), searchPredicate])
  return filter(fullPredicate, transactions)
})

const coinSelectorMap = (state, coin) => {
  switch (coin) {
    case 'BTC':
      return selectors.core.common.btc.getWalletTransactions
    case 'BCH':
      return selectors.core.common.bch.getWalletTransactions
    case 'ETH':
      return selectors.core.common.eth.getWalletTransactions
    case 'XLM':
      return selectors.core.common.xlm.getWalletTransactions
    default:
      return state =>
        selectors.core.common.eth.getErc20WalletTransactions(state, coin)
  }
}

export const getData = (state, coin) =>
  createSelector(
    [
      selectors.form.getFormValues(WALLET_TX_SEARCH),
      coinSelectorMap(state, coin),
      selectors.core.kvStore.buySell.getMetadata,
      selectors.core.settings.getCurrency
    ],
    (userSearch, pages, buySellMetadata, currencyR) => {
      const empty = page => isEmpty(page.data)
      const search = propOr('', 'search', userSearch)
      const status = propOr('', 'status', userSearch)
      const filteredPages = !isEmpty(pages)
        ? pages.map(map(filterTransactions(status, search)))
        : []
      const partnerData = prop('value', buySellMetadata.getOrElse())
      const currency = currencyR.getOrElse('')

      return {
        currency: currency,
        pages: filteredPages,
        empty: all(empty)(filteredPages),
        search: search.length > 0 || status !== '',
        buySellPartner: hasAccount(partnerData)
      }
    }
  )(state)
