import { call, put, select, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions'
import * as sagas from '../../sagas'
import * as selectors from '../../selectors'

export const init = function * (action) {
  try {
    let context = yield select(selectors.core.wallet.getWalletContext)
    yield call(sagas.core.common.bitcoin.fetchBlockchainData, { context })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init balance summary.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_BALANCE_SUMMARY, init)
}
