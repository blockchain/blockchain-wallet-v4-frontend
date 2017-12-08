import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

const init = function * (action) {
  try {
    yield call(sagas.core.data.bitcoin.fetchFee)
    yield call(sagas.core.data.ethereum.fetchFee)
    yield call(sagas.core.data.shapeShift.fetchBtcEth)
    yield call(sagas.core.data.shapeShift.fetchEthBtc)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init coin convertor.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_COIN_CONVERTOR, init)
}
