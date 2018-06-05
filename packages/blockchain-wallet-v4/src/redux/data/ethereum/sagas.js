import { call, put, select } from 'redux-saga/effects'
import { dissoc, isNil, length, mapObjIndexed, path, sum, values } from 'ramda'
import { convertFeeToWei } from '../../../utils/ethereum'
import * as A from './actions'
import * as S from './selectors'
import * as selectors from '../../selectors'

export default ({ api }) => {
  const fetchFee = function * () {
    try {
      yield put(A.fetchFeeLoading())
      const data = yield call(api.getEthereumFee)
      const weiData = convertFeeToWei(data)
      yield put(A.fetchFeeSuccess(weiData))
    } catch (e) {
      yield put(A.fetchFeeFailure(e.message))
    }
  }

  const fetchLatestBlock = function * () {
    try {
      yield put(A.fetchLatestBlockLoading())
      const data = yield call(api.getEthereumLatestBlock)
      yield put(A.fetchLatestBlockSuccess(data))
    } catch (e) {
      yield put(A.fetchLatestBlockFailure(e.message))
    }
  }

  const fetchRates = function * () {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getEthereumTicker)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const fetchData = function * (action) {
    const { payload } = action
    const { reset } = payload
    try {
      const defaultAccountR = yield select(selectors.kvStore.ethereum.getContext)
      const address = defaultAccountR.getOrFail('Could not get ethereum context.')
      const pages = reset ? [] : yield select(S.getTransactions)
      const nextPage = length(pages)
      yield put(A.fetchTransactionsLoading(reset))
      const data = yield call(api.getEthereumTransactions, address, nextPage)
      const latestBlock = yield call(api.getEthereumLatestBlock)
      yield call(accountSaga, data, latestBlock)
      const txs = path([address, 'txns'], data)
      if (isNil(txs)) return
      yield put(A.fetchTransactionsSuccess(txs, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const accountSaga = function * (data, latestBlock) {
    // Accounts treatments
    const finalBalance = sum(values(data).map(obj => obj.balance))
    const totalReceived = sum(values(data).map(obj => obj.totalReceived))
    const totalSent = sum(values(data).map(obj => obj.totalSent))
    const nTx = sum(values(data).map(obj => obj.txn_count))
    const addresses = mapObjIndexed((num, key, obj) => dissoc('txns', num), data)
    // const transactions = mapObjIndexed((num, key, obj) => sortBy(compose(negate, prop('timeStamp')), prop('txns', num)), data)

    const ethereumData = {
      addresses,
      info: {
        n_tx: nTx,
        total_received: totalReceived,
        total_sent: totalSent,
        final_balance: finalBalance
      },
      latest_block: latestBlock
      // transactions
    }
    yield put(A.fetchDataSuccess(ethereumData))
  }

  return {
    fetchFee,
    fetchData,
    fetchRates,
    fetchLatestBlock
  }
}
