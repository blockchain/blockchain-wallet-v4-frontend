import { call, put } from 'redux-saga/effects'
import { compose, dissoc, flatten, mapObjIndexed, prop, sortBy, sum, values } from 'ramda'
import * as A from './actions'

export const commonSaga = ({ api } = {}) => {
  const fetchBlockchainData = function * ({ context }) {
    const data = yield call(api.fetchBlockchainData, context, { n: 1 })
    yield put(A.setBlockchainData(data))
  }

  const fetchEthereumData = function * ({ context }) {
    const data = yield call(api.getEthereumData, context)

    const finalBalance = sum(values(data).map(obj => obj.balance))
    const totalReceived = sum(values(data).map(obj => obj.totalReceived))
    const totalSent = sum(values(data).map(obj => obj.totalSent))
    const nTx = sum(values(data).map(obj => obj.txn_count))
    const addresses = mapObjIndexed((num, key, obj) => dissoc('txns', num), data)
    const transactions = compose(
      sortBy(prop('timestamp')),
      flatten,
      values,
      mapObjIndexed((num, key, obj) => prop('txns', num))
    )(data)

    const ethereumData = {
      addresses,
      info: {
        n_tx: nTx,
        total_received: totalReceived,
        total_sent: totalSent,
        final_balance: finalBalance
      },
      transactions
    }
    console.log(ethereumData)
    yield put(A.setEthereumData(ethereumData))
  }

  return {
    fetchBlockchainData,
    fetchEthereumData
  }
}
