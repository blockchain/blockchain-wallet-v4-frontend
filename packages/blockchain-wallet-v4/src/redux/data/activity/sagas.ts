import { call, fork, put, select } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import {
  NonCustodialCoins,
  ProcessedTxType,
  WalletOptionsType
} from 'blockchain-wallet-v4/src/types'

import * as A from './actions'
import * as S from './selectors'
import * as selectors from '../../selectors'

import bchSagas from '../bch/sagas'
import btcSagas from '../btc/sagas'
import ethSagas from '../eth/sagas'
import xlmSagas from '../xlm/sagas'

import { getNextActivityURL, N } from './services'
import { NabuProducts } from './types'

type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown
}
  ? U
  : T

export default ({
  api,
  networks,
  options
}: {
  api: APIType
  networks
  options: WalletOptionsType
}) => {
  // just re-using existing code for now but clean
  // this up eventually please :)
  const { processTxs: processBtcTxs } = btcSagas({ api })
  const { processTxs: processBchTxs } = bchSagas({ api })
  const { processTxs: processEthTxs, processErc20Txs } = ethSagas({ api })
  const { processTxs: processXlmTxs } = xlmSagas({ api, networks })

  const fetchCustodialActivity = function * () {
    for (const value of NabuProducts) {
      yield put(A.fetchCustodialActivityLoading(value))
    }

    for (const value of NabuProducts) {
      try {
        let transactions: ReturnType<typeof api.getCustodialTxs> = {
          items: [],
          next: null,
          prev: null
        }
        let orders: ReturnType<typeof api.getSBOrders> = []
        let next: string | null = null
        switch (value) {
          case 'SIMPLEBUY':
            next = S.getNextCustodialActivity(value, yield select())
            orders = yield call(api.getSBOrders, {})
            if (next === null) break
            transactions = yield call(api.getCustodialTxs, value, next)
            break
          // TODO
          case 'SWAP':
            transactions = { items: [], next: null, prev: null }
            orders = []
            break
          default:
            next = S.getNextCustodialActivity(value, yield select())
            if (next === null) break
            transactions = yield call(api.getCustodialTxs, value, next)
        }

        yield put(A.fetchCustodialActivitySuccess(value, transactions, orders))
      } catch (e) {
        const error = errorHandler(e)
        yield put(A.fetchCustodialActivityFailure(value, error))
      }
    }
  }

  const fetchNonCustodialActivity = function * () {
    for (const value of NonCustodialCoins) {
      yield put(A.fetchNonCustodialActivityLoading(value))
    }

    for (const value of NonCustodialCoins) {
      const FAILURE = `${value} context failure`

      let transactions: Array<ProcessedTxType> = []
      let next: string | null = null
      try {
        switch (value) {
          case 'BTC': {
            const context: Array<string> = selectors.data.btc.getContext(
              yield select()
            )
            const { nextUrl, offset } = S.getNextNonCustodialActivity(
              value,
              yield select()
            )
            if (nextUrl === null) break
            try {
              const response: ReturnType<typeof api.fetchBlockchainData> = yield call(
                api.fetchBlockchainData,
                context,
                {
                  n: N,
                  offset,
                  onlyShow: context
                },
                nextUrl
              )

              if (response.txs.length === N) {
                next = getNextActivityURL(options, offset, context, value)
              }
              transactions = yield call(processBtcTxs, response.txs)
            } catch (e) {
              const error = errorHandler(e)
              yield put(A.fetchNonCustodialActivityFailure(value, error))
            }
            break
          }
          case 'BCH': {
            const context: Array<string> = selectors.data.bch.getContext(
              yield select()
            )
            const { nextUrl, offset } = S.getNextNonCustodialActivity(
              value,
              yield select()
            )
            if (nextUrl === null) break
            try {
              const response: ReturnType<typeof api.fetchBlockchainData> = yield call(
                api.fetchBchData,
                context,
                {
                  n: N,
                  offset: 0,
                  onlyShow: context
                },
                nextUrl
              )
              if (response.txs.length === N) {
                next = getNextActivityURL(options, offset, context, value)
              }
              transactions = yield call(processBchTxs, response.txs)
            } catch (e) {
              const error = errorHandler(e)
              yield put(A.fetchNonCustodialActivityFailure(value, error))
            }
            break
          }
          case 'PAX':
          case 'USDT': {
            try {
              const { nextUrl, offset } = S.getNextNonCustodialActivity(
                value,
                yield select()
              )
              if (nextUrl === null) break
              const context = (yield select(
                selectors.kvStore.eth.getContext
              )).getOrFail(FAILURE)
              const token = (yield select(
                selectors.kvStore.eth.getErc20ContractAddr,
                value.toLowerCase()
              )).getOrFail(FAILURE)
              const response: ReturnType<typeof api.getErc20TransactionsV2> = yield call(
                api.getErc20TransactionsV2,
                context,
                token,
                offset,
                N,
                nextUrl
              )

              if (response.transfers.length === N) {
                next = getNextActivityURL(
                  options,
                  offset,
                  context,
                  value,
                  token
                )
              }

              transactions = yield call(
                processErc20Txs,
                response.transfers,
                value
              )
            } catch (e) {
              const error = errorHandler(e)
              yield put(A.fetchNonCustodialActivityFailure(value, error))
            }

            break
          }
          case 'ETH': {
            try {
              const { nextUrl, offset } = S.getNextNonCustodialActivity(
                value,
                yield select()
              )
              if (nextUrl === null) break
              const context = (yield select(
                selectors.kvStore.eth.getContext
              )).getOrFail(FAILURE)
              const response: ReturnType<typeof api.getEthTransactionsV2> = yield call(
                api.getEthTransactionsV2,
                context,
                offset,
                N,
                nextUrl
              )

              if (response.transactions.length === N) {
                next = getNextActivityURL(options, offset, context, value)
              }

              transactions = yield call(processEthTxs, response.transactions)
            } catch (e) {
              const error = errorHandler(e)
              yield put(A.fetchNonCustodialActivityFailure(value, error))
            }

            break
          }
          case 'XLM':
            try {
              const { nextUrl } = S.getNextNonCustodialActivity(
                value,
                yield select()
              )
              if (nextUrl === null) break
              const publicKey = (yield select(
                selectors.kvStore.xlm.getDefaultAccountId
              )).getOrFail(FAILURE)
              const response: Await<ReturnType<
                typeof api.getXlmTransactionsV2
              >> = yield call(api.getXlmTransactionsV2, {
                publicKey,
                limit: N,
                pagingToken: next || undefined
              })

              if (response.records.length === N) {
                next = response.records[response.records.length].paging_token
              }

              transactions = yield call(processXlmTxs, response.records)
            } catch (e) {
              const error = errorHandler(e)
              if (error === 'Network Error') {
                // no xlm account created?
                transactions = []
              } else {
                yield put(A.fetchNonCustodialActivityFailure(value, error))
              }
            }

            break
          case 'ALGO':
            // do nothing
            break
          default:
            throw new Error(`${value} fetch tx activity not implemented.`)
        }

        yield put(A.fetchNonCustodialActivitySuccess(value, transactions, next))
      } catch (e) {
        const error = errorHandler(e)
        yield put(A.fetchNonCustodialActivityFailure(value, error))
      }
    }
  }

  const fetchActivity = function * () {
    try {
      yield fork(fetchCustodialActivity)
      yield fork(fetchNonCustodialActivity)
    } catch (e) {
      const error = errorHandler(e)
      // not enough info to do anything
      // eslint-disable-next-line
      console.log(`Activity fetch failure: ${error}`)
    }
  }

  return {
    fetchActivity
  }
}
