import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const commonSaga = ({ api } = {}) => {
  const fetchBlockchainData = function * ({ context }) {
    const data = yield call(api.fetchBlockchainData, context, { n: 1 })
    yield put(A.setBlockchainData(data))
  }

  const fetchEthereumData = function * ({ context }) {
    const data = yield call(api.fetchEthereumData, context)
    yield put(A.setEthereumData(data))
  }

  return {
    fetchBlockchainData,
    fetchEthereumData
  }
}
