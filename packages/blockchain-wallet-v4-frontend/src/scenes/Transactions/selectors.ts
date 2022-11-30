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

import { IngestedSelfCustodyType } from '@core/network/api/coin/types'
import {
  AddressTypesType,
  BSOrderType,
  BSTransactionType,
  ProcessedTxType,
  RemoteDataType
} from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'
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
        (x: string) =>
          filter === '' ||
          (x && toUpper(x) === toUpper(filter)) ||
          (x === 'DEPOSIT' && filter === 'received') ||
          (x === 'WITHDRAWAL' && filter === 'sent') ||
          (x === 'RECEIVED' && filter === 'received') ||
          (x === 'SENT' && filter === 'sent'),
        'type',
        tx
      )
    })
    const search = curry((text, txPath, tx) =>
      compose(includes(toUpper(text || '')), toUpper, String, path(txPath))(tx)
    )

    const searchPredicate = anyPass(
      // @ts-ignore
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
          return (tx as BSOrderType).attributes || (tx as BSTransactionType).extraAttributes
        case '':
          return tx
        default:
          return (tx as ProcessedTxType).blockHeight || (tx as IngestedSelfCustodyType).movements
      }
    }

    // @ts-ignore
    const fullPredicate = allPass([isOfTxType(status), searchPredicate])
    return filter(fullPredicate, transactions.filter(sourceTypeFilter))
  }
)

const coinSelectorMap = (
  state,
  coin
): ((state: RootState) => Array<RemoteDataType<any, Array<TxType>>>) => {
  if (selectors.core.data.coins.getErc20Coins().includes(coin)) {
    return (state) => selectors.core.common.eth.getErc20WalletTransactions(state, coin)
  }
  if (selectors.core.data.coins.getCustodialCoins().includes(coin)) {
    return (state) => selectors.core.common.coins.getWalletTransactions(state, coin)
  }
  if (selectors.core.data.coins.getDynamicSelfCustodyCoins().includes(coin)) {
    return (state) => selectors.core.common.coins.getWalletTransactions(state, coin)
  }
  if (selectors.core.common[toLower(coin)]) {
    return selectors.core.common[toLower(coin)].getWalletTransactions
  }

  // default to fiat
  return (state) => selectors.core.data.fiat.getTransactions(coin, state)
}

export const getData = (state: RootState, ownProps: OwnProps) => {
  const { computedMatch } = ownProps
  const { coin } = computedMatch.params
  const {
    data: {
      tiers: { current = 0 }
    }
  } = selectors.modules.profile.getUserData(state)
  const isGoldTier = current >= 2

  return createSelector(
    [
      () => selectors.core.settings.getInvitations(state),
      selectors.form.getFormValues(WALLET_TX_SEARCH),
      coinSelectorMap(state, coin),
      selectors.core.settings.getCurrency,
      selectors.components.interest.getInterestEligible,
      selectors.components.interest.getStakingEligible
    ],
    (invitationsR, userSearch, pagesR, currencyR, interestEligibleR, stakingEligibleR) => {
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
        coin,
        currency: currencyR.getOrElse(''),
        hasTxResults: !all(empty)(filteredPages),
        interestEligible: interestEligibleR.getOrElse({}),
        isGoldTier,
        isInvited: invitationsR
          .map(propOr(false, 'openBanking'))
          .getOrElse({ openBanking: false }) as boolean,
        // @ts-ignore
        isSearchEntered: search.length > 0 || status !== '',
        pages: filteredPages,
        sourceType,
        stakingEligible: stakingEligibleR.getOrElse({})
      }
    }
  )(state)
}

export default getData
