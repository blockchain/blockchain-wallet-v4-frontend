import { call, put, select } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import {
  NonCustodialCoins,
  ProcessedTxType
} from 'blockchain-wallet-v4/src/types'

import * as A from './actions'
import * as selectors from '../../selectors'

import bchSagas from '../bch/sagas'
import btcSagas from '../btc/sagas'
import ethSagas from '../eth/sagas'
import xlmSagas from '../xlm/sagas'

import { NabuProducts } from './types'

export default ({ api, networks }: { api: APIType; networks }) => {
  // just re-using existing code for now but clean this up eventually please
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

      let transactions: Array<ProcessedTxType> = []
      try {
        switch (value) {
          case 'BTC': {
            const context: Array<string> = selectors.data.btc.getContext(
              yield select()
            )
            try {
              const response: ReturnType<typeof api.fetchBlockchainData> = yield call(
                api.fetchBlockchainData,
                context,
                {
                  n: 10,
                  offset: 0,
                  onlyShow: context
                }
              )
              transactions = yield call(processBtcTxs, response.txs)
            } catch (e) {
              const error = errorHandler(e)
              return yield put(A.fetchNonCustodialActivityFailure(value, error))
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
                  n: 10,
                  offset: 0,
                  onlyShow: context
                }
              )
              transactions = yield call(processBchTxs, response.txs)
            } catch (e) {
              const error = errorHandler(e)
              return yield put(A.fetchNonCustodialActivityFailure(value, error))
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
                20
              )

              transactions = yield call(
                processErc20Txs,
                response.transfers,
                value
              )
            } catch (e) {
              const error = errorHandler(e)
              return yield put(A.fetchNonCustodialActivityFailure(value, error))
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
                20
              )

              transactions = yield call(processEthTxs, response.transactions)
            } catch (e) {
              const error = errorHandler(e)
              return yield put(A.fetchNonCustodialActivityFailure(value, error))
            }

            break
          }
          default:
          // throw new Error(`${value} fetch tx activity not implemented.`)
        }

        yield put(A.fetchNonCustodialActivitySuccess(value, transactions))
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
