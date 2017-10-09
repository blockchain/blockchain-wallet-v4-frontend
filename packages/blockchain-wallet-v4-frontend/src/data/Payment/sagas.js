import { takeEvery, put, call, select } from 'redux-saga/effects'
import { isNil, is } from 'ramda'
import * as AT from './actionTypes'
import { actions, selectors } from 'data'
import { feeSaga } from 'blockchain-wallet-v4/src/redux/data/fee/sagas.js'
import { paymentSaga } from 'blockchain-wallet-v4/src/redux/data/payment/sagas.js'
import { api } from 'services/ApiService'
import { askSecondPasswordEnhancer } from 'services/SecondPasswordService'
import settings from 'config'

import { convertUnitToSatoshis } from 'services/ConversionService'

// const settingsSagas = settingsSaga({ api, walletPath: settings.WALLET_IMMUTABLE_PATH })
const paymentSagas = paymentSaga({ api, dataPath: settings.BLOCKCHAIN_DATA_PATH, walletPath: settings.WALLET_IMMUTABLE_PATH })
const feeSagas = feeSaga({ api })

const initSendBitcoin = function * (action) {
  try {
    yield call(feeSagas.fetchFee)
    const index = yield select(selectors.core.wallet.getDefaultAccountIndex)
    yield call(paymentSagas.getUnspent, index, undefined)
  } catch (e) {
    if (e !== 'No free outputs to spend') {
      yield put(actions.alerts.displayError('Could not init send bitcoin.'))
    }
  } finally {
    const feePerByteRegular = yield select(selectors.core.fee.getRegular)
    yield call(paymentSagas.refreshEffectiveBalance, feePerByteRegular)
    yield put(actions.modals.showModal('SendBitcoin'))
  }
}

const getUnspent = function * (action) {
  const { index, address } = action.payload
  try {
    yield call(paymentSagas.getUnspent, index, address)
  } catch (e) {
    if (e !== 'No free outputs to spend') {
      yield put(actions.alerts.displayError('Could not fetch coin unspent.'))
    }
  }
}

const getSelection = function * (action) {
  try {
    const { from, to, to2, amount, fee, seed } = action.payload
    const finalTo = !isNil(to2) ? to2 : (to.address || to.index)
    let receiveAddress = finalTo
    if (is(Number, finalTo)) {
      receiveAddress = yield select(selectors.core.common.getNextAvailableReceiveAddress(settings.NETWORK, finalTo))
    }
    const finalFrom = from.address || from.index
    let changeAddress = finalFrom
    if (is(Number, finalFrom)) {
      changeAddress = yield select(selectors.core.common.getNextAvailableChangeAddress(settings.NETWORK, finalFrom))
    }
    const unit = yield select(selectors.core.settings.getBtcCurrency)
    const satoshis = convertUnitToSatoshis(amount, unit).value
    const algorithm = 'singleRandomDraw'
    yield call(paymentSagas.refreshSelection, { feePerByte: fee, changeAddress, receiveAddress, satoshis, algorithm, seed })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not calculate selection.'))
  }
}

const getEffectiveBalance = function * (action) {
  const { fee } = action.payload
  try {
    yield call(paymentSagas.refreshEffectiveBalance, { feePerByte: fee })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not calculate selection.'))
  }
}

const sendBitcoin = function * (action) {
  try {
    const saga = askSecondPasswordEnhancer(paymentSagas.signAndPublish)
    yield call(saga, action.payload)
    yield put(actions.form.destroy('sendBitcoin'))
    yield put(actions.modals.closeModal())
    yield put(actions.router.push('/transactions'))
    yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch settings.'))
  }
}

const sagas = function * () {
  yield takeEvery(AT.INIT_SEND_BITCOIN, initSendBitcoin)
  yield takeEvery(AT.GET_UNSPENT, getUnspent)
  yield takeEvery(AT.GET_SELECTION, getSelection)
  yield takeEvery(AT.GET_EFFECTIVE_BALANCE, getEffectiveBalance)
  yield takeEvery(AT.SEND_BITCOIN, sendBitcoin)
}

export default sagas
