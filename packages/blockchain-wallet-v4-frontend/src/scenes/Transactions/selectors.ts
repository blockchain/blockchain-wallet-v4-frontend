import {
  all,
  allPass,
  anyPass,
  compose,
  curry,
  filter,
  includes,
  isEmpty,
  map,
  path,
  pathOr,
  propOr,
  propSatisfies,
  toLower,
  toUpper
} from 'ramda'
import { createSelector } from 'reselect'

import {
  AddressTypesType,
  CoinfigType,
  ProcessedTxType,
  RemoteDataType,
  SBOrderType,
  SBTransactionType
} from 'blockchain-wallet-v4/src/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { TransferType, TxType } from './types'

const { WALLET_TX_SEARCH } = model.form

const filterTransactions = curry(
  (
    status: TransferType,
    criteria,
    sourceType: '' | AddressTypesType,
    transactions: Array<TxType>
  ) => {
    const isOfTxType = curry((filter: TransferType, tx) => {
      return propSatisfies(
        (x) =>
          filter === '' ||
          // @ts-ignore
          (x && toUpper(x) === toUpper(filter)) ||
          (x === 'DEPOSIT' && filter === 'received') ||
          (x === 'WITHDRAWAL' && filter === 'sent'),
        'type',
        tx
      )
    })
    const search = curry((text, txPath, tx) =>
      compose(includes(toUpper(text || '')), toUpper, String, path(txPath))(tx)
    )
    const searchPredicate = anyPass(
      map(search(criteria), [
        ['id'],
        ['description'],
        ['from'],
        ['to'],
        ['hash'],
        ['outputs', 0, 'address'],
        ['inputs', 0, 'address']
      ])
    )

    const sourceTypeFilter = (tx: TxType) => {
      switch (sourceType) {
        case 'CUSTODIAL':
          return (tx as SBOrderType).attributes || (tx as SBTransactionType).extraAttributes
        case '':
          return tx
        default:
          return (tx as ProcessedTxType).blockHeight
      }
    }

    const fullPredicate = allPass([isOfTxType(status), searchPredicate])
    return filter(fullPredicate, transactions.filter(sourceTypeFilter))
  }
)

const coinSelectorMap = (
  state,
  coin,
  coinfig: CoinfigType
): ((state: RootState) => Array<RemoteDataType<any, Array<TxType>>>) => {
  if (coinfig.type.erc20Address) {
    return (state) => selectors.core.common.eth.getErc20WalletTransactions(state, coin)
  }
  if (selectors.core.data.coins.getCoins().includes(coin)) {
    return (state) => selectors.core.common.coins.getWalletTransactions(state, coin)
  }
  if (selectors.core.common[toLower(coin)]) {
    return selectors.core.common[toLower(coin)].getWalletTransactions
  }

  // default to fiat
  return (state) => selectors.core.data.fiat.getTransactions(coin, state)
}

export const getData = (state, coin, coinfig: CoinfigType) =>
  createSelector(
    [
      () => selectors.core.settings.getInvitations(state),
      selectors.form.getFormValues(WALLET_TX_SEARCH),
      coinSelectorMap(state, coin, coinfig),
      selectors.core.settings.getCurrency,
      selectors.components.recurringBuy.getRegisteredListByCoin(coin),
      selectors.core.walletOptions.getFeatureFlagRecurringBuys
    ],
    (invitationsR, userSearch, pagesR, currencyR, recurringBuys, isRecurringBuyR) => {
      const empty = (page) => isEmpty(page.data)
      const search = propOr('', 'search', userSearch)
      const status: TransferType = propOr('', 'status', userSearch)
      const sourceType: '' | AddressTypesType = pathOr('', ['source', 'type'], userSearch)
      const filteredPages =
        pagesR && !isEmpty(pagesR)
          ? pagesR.map((pages: typeof pagesR[0]) =>
              map(filterTransactions(status, search, sourceType), pages)
            )
          : []

      return {
        currency: currencyR.getOrElse(''),
        hasTxResults: !all(empty)(filteredPages),
        isInvited: invitationsR
          .map(propOr(false, 'openBanking'))
          .getOrElse({ openBanking: false }) as boolean,
        isRecurringBuy: isRecurringBuyR.getOrElse(false) as boolean,
        // @ts-ignore
        isSearchEntered: search.length > 0 || status !== '',
        pages: filteredPages,
        recurringBuys,
        sourceType
      }
    }
  )(state)

export default getData
