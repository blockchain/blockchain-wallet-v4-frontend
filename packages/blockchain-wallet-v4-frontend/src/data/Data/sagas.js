import { takeEvery, put, call, all, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actions, selectors } from 'data'
import { ratesSaga } from 'blockchain-wallet-v4/src/redux/data/rates/sagas.js'
import { commonSaga } from 'blockchain-wallet-v4/src/redux/common/sagas.js'
import { api } from 'services/ApiService'

const ratesSagas = ratesSaga({ api })
const commonSagas = commonSaga({ api })

const initData = function * (action) {
  try {
    const context = yield select(selectors.core.wallet.getWalletContext)          
    yield all([
      call(commonSagas.fetchBlockchainData, { context }),
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
