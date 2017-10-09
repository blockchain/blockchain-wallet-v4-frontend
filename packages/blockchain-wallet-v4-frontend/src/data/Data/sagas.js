import { takeEvery, put, call, all, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actions, selectors } from 'data'
import { advertsSaga } from 'blockchain-wallet-v4/src/redux/data/adverts/sagas.js'
import { captchaSaga } from 'blockchain-wallet-v4/src/redux/data/captcha/sagas.js'
import { chartsSaga } from 'blockchain-wallet-v4/src/redux/data/charts/sagas.js'
import { logsSaga } from 'blockchain-wallet-v4/src/redux/data/logs/sagas.js'
import { ratesSaga } from 'blockchain-wallet-v4/src/redux/data/rates/sagas.js'
import { commonSaga } from 'blockchain-wallet-v4/src/redux/common/sagas.js'
import { api } from 'services/ApiService'
import settings from 'config'

const advertsSagas = advertsSaga({ api })
const captchaSagas = captchaSaga({ api })
const chartsSagas = chartsSaga({ api })
const logsSagas = logsSaga({ api, walletPath: settings.WALLET_IMMUTABLE_PATH })
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

const getAdverts = function * (action) {
  try {
    yield call(advertsSagas.fetchAdverts, action.payload)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch adverts.'))
  }
}

const getCaptcha = function * (action) {
  try {
    yield call(captchaSagas.fetchCaptcha)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch captcha.'))
  }
}

const getPriceIndexSeries = function * (action) {
  try {
    yield call(chartsSagas.fetchPriceIndexSeries, action.payload)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch price index series.'))
  }
}

const getLogs = function * (action) {
  try {
    yield call(logsSagas.fetchLogs)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch logs.'))
  }
}

const sagas = function * () {
  yield takeEvery(AT.INIT_DATA, initData)
  yield takeEvery(AT.GET_ADVERTS, getAdverts)
  yield takeEvery(AT.GET_CAPTCHA, getCaptcha)
  yield takeEvery(AT.GET_PRICE_INDEX_SERIES, getPriceIndexSeries)
  yield takeEvery(AT.GET_LOGS, getLogs)
}

export default sagas
