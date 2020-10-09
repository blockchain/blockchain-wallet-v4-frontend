import { call, put, select } from 'redux-saga/effects'

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

import { NabuProducts } from './types'

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
  // eslint-disable-next-line
  const { processTxs: processXlmTxs } = xlmSagas({ api, networks })

  const fetchCustodialActivity = function * () {
    for (const value of NabuProducts) {
      yield put(A.fetchCustodialActivityLoading(value))
    }

    for (const value of NabuProducts) {
      try {
        let transactions: ReturnType<typeof api.getCustodialTxs>
        let orders: ReturnType<typeof api.getSBOrders> = []
        switch (value) {
          case 'SIMPLEBUY':
            transactions = yield call(api.getCustodialTxs, value)
            orders = yield call(api.getSBOrders, {})
            break
          // TODO
          case 'SWAP':
            transactions = { items: [], next: null, prev: null }
            orders = []
            break
          default:
            transactions = yield call(api.getCustodialTxs, value)
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
      const N = 20

      let transactions: Array<ProcessedTxType> = []
      let next: string | null = null
      try {
        switch (value) {
          case 'BTC': {
            const context: Array<string> = selectors.data.btc.getContext(
              yield select()
            )
            try {
              const nextUrl = S.getNextNonCustodialActivity(
                value,
                yield select()
              )
              const offset = nextUrl
                ? Number(new URLSearchParams(nextUrl).get('offset'))
                : 0
              const response: ReturnType<typeof api.fetchBlockchainData> = yield call(
                api.fetchBlockchainData,
                context,
                {
                  n: N,
                  offset,
                  onlyShow: context,
                  next: nextUrl
                }
              )

              if (response.txs.length === N) {
                next = `${
                  options.domains.root
                }/multiaddr?active=${context}&onlyShow=${context}&offset=${offset +
                  // last & is needed
                  N}&n=${N}&`
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
            try {
              const response: ReturnType<typeof api.fetchBlockchainData> = yield call(
                api.fetchBchData,
                context,
                {
                  n: N,
                  offset: 0,
                  onlyShow: context
                }
              )
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
              const context = (yield select(
                selectors.kvStore.eth.getContext
              )).getOrFail(FAILURE)
              const contractAddress = (yield select(
                selectors.kvStore.eth.getErc20ContractAddr,
                value.toLowerCase()
              )).getOrFail(FAILURE)
              const response: ReturnType<typeof api.getErc20TransactionsV2> = yield call(
                api.getErc20TransactionsV2,
                context,
                contractAddress,
                0,
                N
              )

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
              const context = (yield select(
                selectors.kvStore.eth.getContext
              )).getOrFail(FAILURE)
              const response: ReturnType<typeof api.getEthTransactionsV2> = yield call(
                api.getEthTransactionsV2,
                context,
                0,
                N
              )

              transactions = yield call(processEthTxs, response.transactions)
            } catch (e) {
              const error = errorHandler(e)
              yield put(A.fetchNonCustodialActivityFailure(value, error))
            }

            break
          }
          case 'XLM':
            try {
              const publicKey = (yield select(
                selectors.kvStore.xlm.getDefaultAccountId
              )).getOrFail(FAILURE)
              const response = yield call(api.getXlmTransactions, {
                publicKey,
                limit: N
              })

              // eslint-disable-next-line
              console.log(response)
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
      yield call(fetchCustodialActivity)
      yield call(fetchNonCustodialActivity)
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
