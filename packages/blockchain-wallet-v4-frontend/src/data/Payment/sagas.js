import { takeEvery, put, call, select } from 'redux-saga/effects'
import { isNil, is } from 'ramda'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as selectors from '../selectors.js'
import * as sagas from '../sagas.js'
import { api } from 'services/ApiService'
import settings from 'config'
import { askSecondPasswordEnhancer } from 'services/SecondPasswordService'
import { convertUnitToSatoshis } from 'services/ConversionService'

const initSendBitcoin = function * (action) {
  try {
    yield call(sagas.core.fee.fetchFee)
    const index = yield select(selectors.core.wallet.getDefaultAccountIndex)
    yield call(sagas.core.payment.getUnspent, index, undefined)
  } catch (e) {
    if (e !== 'No free outputs to spend') {
      yield put(actions.alerts.displayError('Could not init send bitcoin.'))
    }
  } finally {
    const feePerByte = yield select(selectors.core.fee.getRegular)
    yield call(sagas.core.payment.refreshEffectiveBalance, { feePerByte })
    yield put(actions.modals.showModal('SendBitcoin'))
  }
}

const getUnspent = function * (action) {
  const { index, address } = action.payload
  try {
    yield call(sagas.core.payment.getUnspent, index, address)
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
    const unit = yield select(selectors.core.settings.getBtcUnit)
    const satoshis = convertUnitToSatoshis(amount, unit).value
    const algorithm = 'singleRandomDraw'
    yield call(sagas.core.payment.refreshSelection, { feePerByte: fee, changeAddress, receiveAddress, satoshis, algorithm, seed })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not calculate selection.'))
  }
}

const getEffectiveBalance = function * (action) {
  const { fee } = action.payload
  try {
    yield call(sagas.core.payment.refreshEffectiveBalance, { feePerByte: fee })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not calculate selection.'))
  }
}

const sendBitcoin = function * (action) {
  try {
    const saga = askSecondPasswordEnhancer(sagas.core.payment.signAndPublish)
    yield call(saga, action.payload)
    yield put(actions.form.destroy('sendBitcoin'))
    yield put(actions.modals.closeModal())
    yield put(actions.router.push('/transactions'))
    yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch settings.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_SEND_BITCOIN, initSendBitcoin)
  yield takeEvery(AT.GET_UNSPENT, getUnspent)
  yield takeEvery(AT.GET_SELECTION, getSelection)
  yield takeEvery(AT.GET_EFFECTIVE_BALANCE, getEffectiveBalance)
  yield takeEvery(AT.SEND_BITCOIN, sendBitcoin)
}
