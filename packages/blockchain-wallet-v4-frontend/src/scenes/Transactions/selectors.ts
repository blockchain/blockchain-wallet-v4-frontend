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
  ProcessedTxType,
  RemoteDataType,
  SBOrderType,
  SBTransactionType,
  SupportedWalletCurrenciesType,
  WalletCurrencyType
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
        x =>
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
          return (
            (tx as SBOrderType).attributes ||
            (tx as SBTransactionType).extraAttributes
          )
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
  isCoinErc20
): ((state: RootState) => Array<RemoteDataType<any, Array<TxType>>>) => {
  if (isCoinErc20) {
    return state =>
      selectors.core.common.eth.getErc20WalletTransactions(state, coin)
  }
  if (selectors.core.common[toLower(coin)]) {
    return selectors.core.common[toLower(coin)].getWalletTransactions
  }

  // default to fiat
  return state => selectors.core.data.fiat.getTransactions(coin, state)
}

export const getData = (state, coin, isCoinErc20) =>
  createSelector(
    [
      selectors.form.getFormValues(WALLET_TX_SEARCH),
      coinSelectorMap(state, coin, isCoinErc20),
      selectors.core.settings.getCurrency,
      () => selectors.core.walletOptions.getCoinModel(state, coin),
      () => selectors.core.walletOptions.getSupportedCoins(state)
    ],
    (userSearch, pagesR, currencyR, coinModelR, supportedCoinsR) => {
      const empty = page => isEmpty(page.data)
      const search = propOr('', 'search', userSearch)
      const status: TransferType = propOr('', 'status', userSearch)
      const sourceType: '' | AddressTypesType = pathOr(
        '',
        ['source', 'type'],
        userSearch
      )
      const filteredPages =
        pagesR && !isEmpty(pagesR)
          ? pagesR.map((pages: typeof pagesR[0]) =>
              map(filterTransactions(status, search, sourceType), pages)
            )
          : []

      return {
        coinModel: coinModelR.getOrElse(
          {} as <P extends WalletCurrencyType>(
            p: P
          ) => SupportedWalletCurrenciesType[P]
        ),
        currency: currencyR.getOrElse(''),
        hasTxResults: !all(empty)(filteredPages),
        // @ts-ignore
        isSearchEntered: search.length > 0 || status !== '',
        pages: filteredPages,
        sourceType,
        supportedCoins: supportedCoinsR.getOrElse(
          {} as SupportedWalletCurrenciesType
        )
      }
    }
  )(state)
