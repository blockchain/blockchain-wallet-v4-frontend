import { takeEvery, put, call, select } from 'redux-saga/effects'
import { isNil, is } from 'ramda'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as selectors from '../selectors.js'
import * as sagas from '../sagas.js'
import settings from 'config'
import { askSecondPasswordEnhancer } from 'services/SecondPasswordService'
import { convertUnitToSatoshis } from 'services/ConversionService'

export const initSendBitcoin = function * (action) {
  try {
    yield call(sagas.core.data.bitcoin.fetchFee)
    const index = yield select(selectors.core.wallet.getDefaultAccountIndex)
    yield call(sagas.core.data.bitcoin.getUnspent, index, undefined)
  } catch (e) {
    if (e !== 'No free outputs to spend') {
      yield put(actions.alerts.displayError('Could not init send bitcoin.'))
    }
  } finally {
    const feePerByte = yield select(selectors.core.data.bitcoin.getRegular)
    yield call(sagas.core.data.bitcoin.refreshEffectiveBalance, { feePerByte })
    yield put(actions.modals.closeAllModals())
    yield put(actions.modals.showModal('SendBitcoin'))
  }
}

export const initSendEthereum = function * (action) {
  try {
    // yield call(sagas.core.ethereum.fee.fetchFee)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init send ethereum.'))
  } finally {
    // const feePerByte = yield select(selectors.core.data.ethereum.getRegular)
    // yield call(sagas.core.data.ethereum.refreshEffectiveBalance, { feePerByte })
    yield put(actions.modals.closeAllModals())
    yield put(actions.modals.showModal('SendEthereum'))
  }
}

export const getUnspent = function * (action) {
  const { index, address } = action.payload
  try {
    yield call(sagas.core.data.bitcoin.getUnspent, index, address)
  } catch (e) {
    if (e !== 'No free outputs to spend') {
      yield put(actions.alerts.displayError('Could not fetch coin unspent.'))
    }
  }
}

export const getSelection = function * (action) {
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
    yield put(actions.alerts.displayError('Could not calculate selection.'))
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
  yield takeEvery(AT.INIT_SEND_ETHEREUM, initSendEthereum)
  yield takeEvery(AT.GET_UNSPENT, getUnspent)
  yield takeEvery(AT.GET_SELECTION, getSelection)
  yield takeEvery(AT.GET_EFFECTIVE_BALANCE, getEffectiveBalance)
  yield takeEvery(AT.SEND_BITCOIN, sendBitcoin)
}
