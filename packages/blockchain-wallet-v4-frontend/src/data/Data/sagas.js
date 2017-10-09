import { takeEvery, put, call, all } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actions } from 'data'
import { ratesSaga } from 'blockchain-wallet-v4/src/redux/data/rates/sagas.js'
import { api } from 'services/ApiService'

const ratesSagas = ratesSaga({ api })

const initData = function * (action) {
  try {
    yield all([
      call(ratesSagas.refreshEthereumRates),
      call(ratesSagas.refreshBitcoinRates)
    ])
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch data.'))
  }
}

const sagas = function * () {
  yield takeEvery(AT.INIT_DATA, initData)
}

export default sagas
