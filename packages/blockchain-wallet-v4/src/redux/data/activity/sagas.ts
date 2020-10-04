import { call, put, select } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import {
  EthRawTxType,
  NonCustodialCoins,
  RawBtcTxType
} from 'blockchain-wallet-v4/src/types'

import * as A from './actions'
import * as selectors from '../../selectors'

import { NabuProducts } from './types'

export default ({ api }: { api: APIType }) => {
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

      let transactions: Array<RawBtcTxType | EthRawTxType> = []
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
              transactions = response.txs
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
                  n: 10,
                  offset: 0,
                  onlyShow: context
                }
              )
              transactions = response.txs
            } catch (e) {
              const error = errorHandler(e)
              yield put(A.fetchNonCustodialActivityFailure(value, error))
            }
            break
          }
          case 'PAX':
          case 'USDT': {
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

            console.log(response)

            break
          }
          case 'ETH': {
            const context = (yield select(
              selectors.kvStore.eth.getContext
            )).getOrFail(FAILURE)
            const response: ReturnType<typeof api.getEthTransactionsV2> = yield call(
              api.getEthTransactionsV2,
              context,
              0,
              20
            )

            transactions = response.transactions

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
