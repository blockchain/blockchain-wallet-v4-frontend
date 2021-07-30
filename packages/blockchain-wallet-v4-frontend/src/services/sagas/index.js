import { assoc } from 'ramda'
import { call, put, race, select, take } from 'redux-saga/effects'

import { Types } from 'blockchain-wallet-v4/src'
import { actions, actionTypes, selectors } from 'data'

export const askSecondPasswordEnhancer = (coreSaga) =>
  function* (args) {
    let enhancedArgs = args
    const wallet = yield select(selectors.core.wallet.getWallet)
    if (Types.Wallet.isDoubleEncrypted(wallet)) {
      yield put(actions.modals.showModal('SECOND_PASSWORD_MODAL'))
      const secPassAct = yield take(actionTypes.wallet.SUBMIT_SECOND_PASSWORD)
      const secPass = secPassAct.payload.password
      enhancedArgs = assoc('password', secPass, args)
    }
    return yield call(coreSaga, enhancedArgs)
  }

export const promptForSecondPassword = function* (purposes) {
  const wallet = yield select(selectors.core.wallet.getWallet)
  if (Types.Wallet.isDoubleEncrypted(wallet)) {
    yield put(actions.modals.showModal('SECOND_PASSWORD_MODAL', { purposes }))
    const { cancelled, response } = yield race({
      cancelled: take(actionTypes.modals.CLOSE_MODAL),
      response: take(actionTypes.wallet.SUBMIT_SECOND_PASSWORD)
    })
    if (cancelled) {
      throw new Error('PROMPT_FOR_SEC_PW_CANCEL')
    } else {
      return response.payload.password
    }
  }
}

export const promptForInput = function* ({
  title,
  secret = false,
  initial = '',
  maxLength,
  validations = []
}) {
  yield put(
    actions.modals.showModal('PROMPT_INPUT_MODAL', {
      initial,
      maxLength,
      secret,
      title,
      validations
    })
  )
  const { cancelled, response } = yield race({
    cancelled: take(actionTypes.modals.CLOSE_MODAL),
    response: take(actionTypes.wallet.SUBMIT_PROMPT_INPUT)
  })
  if (cancelled) {
    throw new Error('PROMPT_INPUT_CANCEL')
  } else {
    yield put(actions.modals.closeModal())
    return response.payload.value
  }
}

export const confirm = function* ({
  cancel,
  confirm,
  image,
  message,
  messageValues,
  nature,
  title
}) {
  yield put(
    actions.modals.showModal('CONFIRMATION_MODAL', {
      cancel,
      confirm,
      image,
      message,
      messageValues,
      nature,
      title
    })
  )
  const { cancelled, response } = yield race({
    cancelled: take(actionTypes.modals.CLOSE_MODAL),
    response: take(actionTypes.wallet.SUBMIT_CONFIRMATION)
  })
  if (cancelled) {
    throw new Error('CONFIRM_CANCELED')
  } else {
    yield put(actions.modals.closeModal())
    return response.payload.value
  }
}
