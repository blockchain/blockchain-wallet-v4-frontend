import { createSelector } from 'reselect'
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
  propOr,
  toLower
} from 'ramda'

import { model } from '../../../data/index'
import * as selectors from '../../../data/selectors'
import { hasAccount } from '../../../services/ExchangeService'

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
  const erc20List = selectors.core.walletOptions
    .getErc20CoinList(state)
    .getOrFail()
  if (includes(coin, erc20List)) {
    return state =>
      selectors.core.common.eth.getErc20WalletTransactions(state, coin)
  }
  return selectors.core.common[toLower(coin)].getWalletTransactions
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
      const filteredPages =
        pages && !isEmpty(pages)
          ? // @ts-ignore
            // @ts-ignore
            pages.map(map(filterTransactions(status, search)))
          : []
      // @ts-ignore
      const partnerData = prop('value', buySellMetadata.getOrElse())
      // @ts-ignore
      const currency = currencyR.getOrElse('')
      // TS Testing
      const btcAtBounds = selectors.core.data.btc.getTransactionsAtBound(state)

      return {
        currency: currency,
        btcAtBounds,
        pages: filteredPages,
        empty: all(empty)(filteredPages),
        search: search.length > 0 || status !== '',
        buySellPartner: hasAccount(partnerData)
      }
    }
  )(state)
