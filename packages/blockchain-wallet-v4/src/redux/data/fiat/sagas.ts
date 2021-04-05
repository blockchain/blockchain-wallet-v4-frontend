import moment from 'moment'
import { filter, last, take as takeR } from 'ramda'
import { call, put, select, take } from 'redux-saga/effects'

import { CoinType, FiatType } from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { APIType } from 'core/network/api'

import Remote from '../../../remote'
import { FiatSBAndSwapTransactionType } from '../custodial/types'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'

const PAGE_SIZE = 20

export default ({ api }: { api: APIType }) => {
  const watchTransactions = function * () {
    while (true) {
      const action = yield take(AT.FETCH_FIAT_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const fetchTransactions = function * (
    action: ReturnType<typeof A.fetchTransactions>
  ) {
    try {
      const { payload } = action
      const { currency, reset } = payload
      const data = S.getFiatData(currency, yield select())

      // previous page request is still pending, return
      if (data && Remote.Loading.is(last(data.page))) return

      // get next page start time and last sb tx id for next potential requests
      const nextSwapPageTimestamp = data?.nextSwapPageTimestamp.getOrElse(
        undefined
      )
      const nextSbTxId = data?.nextSbTxId.getOrElse(undefined)
      const nextSbTxTimestamp = data?.nextSbTxTimestamp.getOrElse(undefined)

      // if we have no next page timestamp, no next sb transaction id and there are
      // existing transactions indicates that there are no more transactions to fetch, return
      if (
        !nextSwapPageTimestamp?.length &&
        !nextSbTxId &&
        !reset &&
        data?.page.length
      )
        return

      // set next page as loading
      yield put(A.fetchTransactionsLoading(action.payload.currency, !!reset))

      let sbTransactions: ReturnType<typeof api.getSBTransactions> = {
        items: [],
        prev: null,
        next: null
      }
      let swapTransactions: Array<FiatSBAndSwapTransactionType> = []

      // if one of the following are true, we request more transactions
      // 1) no transactions exist
      // 2) we have a next SB data stored (last tx id and timestamp)
      // 3) we have a next swap page timestamp
      // 4) reset === true
      if (
        !data?.page.length ||
        (nextSbTxId && nextSbTxTimestamp) ||
        nextSwapPageTimestamp ||
        reset
      ) {
        // fetch sb transactions
        sbTransactions = yield call(api.getSBTransactions, {
          currency: action.payload.currency,
          fromId: reset ? undefined : nextSbTxId,
          fromValue: reset ? undefined : nextSbTxTimestamp,
          limit: PAGE_SIZE
        })
        // fetch swap transactions
        const rawSwapTransactions = yield call(
          api.getUnifiedSwapTrades,
          currency as CoinType,
          PAGE_SIZE,
          reset ? undefined : nextSwapPageTimestamp
        )

        // create a view model that looks like a SB transaction for easier component rendering
        swapTransactions = rawSwapTransactions.map(
          swap =>
            ({
              amount: {
                symbol: swap.pair.split('-')[0] as CoinType,
                inputMoney: swap.priceFunnel.inputMoney,
                fiatSymbol: swap.pair.split('-')[1] as FiatType
              },
              amountMinor: swap.priceFunnel.outputMoney,
              extraAttributes: {
                direction: swap.kind.direction,
                indicativePrice: swap.priceFunnel.indicativePrice
              },
              id: swap.id,
              insertedAt: swap.createdAt,
              state: swap.state,
              type: 'SELL'
            } as FiatSBAndSwapTransactionType)
        )
      }

      // we have all potential page data, merge tx lists together, sort by timestamp,
      // take just the first 20 transactions and discard the rest
      //
      // 🚨 NOTE 🚨  taking just PAGE_SIZE transactions and discarding rest
      // is NOT PERFORMANT but its the easiest way to ensure that future page
      // requests are built correctly and we dont miss transactions
      const nextTransactionPage = takeR(
        PAGE_SIZE,
        [...sbTransactions.items, ...swapTransactions].sort((a, b) => {
          return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
        })
      ) as Array<FiatSBAndSwapTransactionType>

      // if the now pruned transaction list are less than PAGE_SIZE, no more
      // transactions remain, else grab data needed from next page requests
      let lastSbTxId, lastSbTxTimestamp, nextSwapTimestamp
      if (nextTransactionPage.length === PAGE_SIZE) {
        nextSwapTimestamp = last(nextTransactionPage)?.insertedAt as string
        lastSbTxId = last(filter(tx => tx.type !== 'SELL', nextTransactionPage))
          ?.id as string
        lastSbTxTimestamp = last(
          filter(tx => tx.type !== 'SELL', nextTransactionPage)
        )?.insertedAt as string
      }

      // set new page transactions and metadata for future requests on state
      yield put(
        A.fetchTransactionsSuccess(
          action.payload.currency,
          {
            page: nextTransactionPage,
            nextSbTxId: lastSbTxId,
            nextSbTxTimestamp: lastSbTxTimestamp,
            nextSwapPageTimestamp: nextSwapTimestamp
          },
          reset
        )
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchTransactionsFailure(action.payload.currency, error))
    }
  }

  return {
    fetchTransactions,
    watchTransactions
  }
}
