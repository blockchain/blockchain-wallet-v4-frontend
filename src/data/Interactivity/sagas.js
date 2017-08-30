import { takeEvery, put, select } from 'redux-saga/effects'
import { actions as reduxFormActions } from 'redux-form'
import { push } from 'react-router-redux'
import { isNil } from 'ramda'
import bip21 from 'bip21'

import { actions, actionTypes, selectors } from 'data'
import { convertToUnit, convertFromUnit } from 'services/ConversionService'
import * as AT from './actionTypes'

// =============================================================================
// =========================== QrCodeCapture modal =============================
// =============================================================================

const qrCodeCaptureSuccess = function * (action) {
  const { payload } = action
  const { data } = payload

  if (data) {
    const decodedData = bip21.decode(data)
    const address = decodedData.address
    const amount = decodedData.options.amount
    const message = decodedData.options.message

    if (isNil(address)) {
      yield put(actions.alerts.displayError('An error occured when capturing the QRCode.'))
      return
    }

    yield put(reduxFormActions.change('sendBitcoin', 'to', address))

    if (!isNil(amount)) {
      // const unit = yield select(selectors.core.settings.getBtcCurrency)
      // TODO: conversion here FFS
      yield put(reduxFormActions.change('sendBitcoin', 'amount', amount))
    }

    if (!isNil(message)) {
      yield put(reduxFormActions.change('sendBitcoin', 'message', message))
    }

    yield put(actions.modals.closeModal())
  }
}

const qrCodeCaptureError = function * (action) {
  const { payload } = action
  yield put(actions.alerts.displayError(payload))
  yield put(actions.modals.closeModal())
}

// =============================================================================
// ============================ SendBitcoin modal ==============================
// =============================================================================

const signAndPublishSuccess = function * (action) {
  yield put(reduxFormActions.destroy('sendBitcoin'))
  yield put(actions.modals.closeModal())
  yield put(push('/transactions'))
  yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
}

const signAndPublishError = function * (action) {
  const { payload } = action
  yield put(actions.alerts.displayError(payload))
}

// =============================================================================
// =============================== Pairing Code ================================
// =============================================================================
const requestPairingCodeSuccess = function * (action) {
  const { payload } = action
  const { encryptionPhrase } = payload
  yield put(actions.modals.showModal('PairingCode', { data: encryptionPhrase }))
}

const requestPairingCodeError = function * (action) {
  const { payload } = action
  yield put(actions.alerts.displayError(payload))
}

// =============================================================================
// ================================= Language ==================================
// =============================================================================
const updateLanguageSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateLanguageError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// ================================= Currency ==================================
// =============================================================================
const updateCurrencySuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateCurrencyError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// =============================== Bitcoin Unit ================================
// =============================================================================
const updateBitcoinUnitSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateBitcoinUnitError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================== EXPORT ======================================

function * sagas () {
  yield takeEvery(AT.QRCODE_CAPTURE_SUCCESS, qrCodeCaptureSuccess)
  yield takeEvery(AT.QRCODE_CAPTURE_ERROR, qrCodeCaptureError)
  yield takeEvery(actionTypes.core.settings.REQUEST_PAIRING_CODE_SUCCESS, requestPairingCodeSuccess)
  yield takeEvery(actionTypes.core.settings.REQUEST_PAIRING_CODE_ERROR, requestPairingCodeError)
  yield takeEvery(actionTypes.core.payment.SIGN_AND_PUBLISH_SUCCESS, signAndPublishSuccess)
  yield takeEvery(actionTypes.core.payment.SIGN_AND_PUBLISH_ERROR, signAndPublishError)
  yield takeEvery(actionTypes.core.settings.UPDATE_LANGUAGE_SUCCESS, updateLanguageSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_LANGUAGE_ERROR, updateLanguageError)
  yield takeEvery(actionTypes.core.settings.UPDATE_CURRENCY_SUCCESS, updateCurrencySuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_CURRENCY_ERROR, updateCurrencyError)
  yield takeEvery(actionTypes.core.settings.UPDATE_BITCOIN_UNIT_SUCCESS, updateBitcoinUnitSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_BITCOIN_UNIT_ERROR, updateBitcoinUnitError)
}

export default sagas
