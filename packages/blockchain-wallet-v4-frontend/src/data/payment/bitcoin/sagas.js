import { takeEvery, put, call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { isNil, is, prop } from 'ramda'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as selectors from '../../selectors.js'
import * as sagas from '../../sagas.js'
import settings from 'config'
import { askSecondPasswordEnhancer } from 'services/SecondPasswordService'
import { Exchange } from 'blockchain-wallet-v4/src'

export const initSendBitcoin = function * (action) {
  try {
    yield put(actions.modals.closeAllModals())
    yield put(actions.modals.showModal('SendBitcoin', undefined, { loading: true }))
    yield call(sagas.core.data.bitcoin.fetchFee)
    const index = yield select(selectors.core.wallet.getDefaultAccountIndex)
    yield call(sagas.core.data.bitcoin.fetchUnspent, index, undefined)
    const feePerByte = yield select(selectors.core.data.bitcoin.getFeeRegular)
    yield call(sagas.core.data.bitcoin.refreshEffectiveBalance, { feePerByte })
    yield call(delay, 2000)
    yield put(actions.modals.updateModalOptions({ loading: false }))
  } catch (e) {
    if (e !== 'No free outputs to spend') {
      yield put(actions.alerts.displayError('Could not init send bitcoin.'))
    }
  }
}

export const getUnspent = function * (action) {
  const { index, address } = action.payload
  try {
    yield call(sagas.core.data.bitcoin.fetchUnspent, index, address)
  } catch (e) {
    if (e !== 'No free outputs to spend') {
      yield put(actions.alerts.displayError('Could not fetch coin unspent.'))
    }
  }
}

export const getSelection = function * (action) {
  try {
    const { from, to, to2, amount, fee, seed } = action.payload
    const finalTo = !isNil(to2) ? to2 : (prop('address', to) || prop('index', to))
    let receiveAddress = finalTo
    if (is(Number, finalTo)) {
      receiveAddress = yield select(selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK, finalTo))
    }
    const finalFrom = from.address || from.index
    let changeAddress = finalFrom
    if (is(Number, finalFrom)) {
      changeAddress = yield select(selectors.core.common.bitcoin.getNextAvailableChangeAddress(settings.NETWORK, finalFrom))
    }
    const unit = yield select(selectors.core.settings.getBtcUnit)
    const satoshis = Exchange.convertBitcoinToBitcoin({ value: amount, fromUnit: unit, toUnit: 'SAT' }).value
    const algorithm = 'singleRandomDraw'
    yield call(sagas.core.data.bitcoin.refreshSelection, { feePerByte: fee, changeAddress, receiveAddress, satoshis, algorithm, seed })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not calculate selection.'))
  }
}

export const getEffectiveBalance = function * (action) {
  const { fee } = action.payload
  try {
    yield call(sagas.core.data.bitcoin.refreshEffectiveBalance, { feePerByte: fee })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not get effective balance.'))
  }
}

export const sendBitcoin = function * (action) {
  try {
    const saga = askSecondPasswordEnhancer(sagas.core.data.bitcoin.signAndPublish)
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
  yield takeEvery()
}
