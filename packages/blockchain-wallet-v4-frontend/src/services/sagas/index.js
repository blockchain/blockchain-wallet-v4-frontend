import { assoc } from 'ramda'
import { call, put, race, select, take } from 'redux-saga/effects'

import { Types } from 'blockchain-wallet-v4/src'
import { actions, actionTypes, selectors } from 'data'

export const askSecondPasswordEnhancer = coreSaga =>
  function * (args) {
    let enhancedArgs = args
    const wallet = yield select(selectors.core.wallet.getWallet)
    if (Types.Wallet.isDoubleEncrypted(wallet)) {
      yield put(actions.modals.showModal('SecondPassword'))
      const secPassAct = yield take(actionTypes.wallet.SUBMIT_SECOND_PASSWORD)
      const secPass = secPassAct.payload.password
      enhancedArgs = assoc('password', secPass, args)
    }
    return yield call(coreSaga, enhancedArgs)
  }

export const promptForSecondPassword = function * (purposes) {
  const wallet = yield select(selectors.core.wallet.getWallet)
  if (Types.Wallet.isDoubleEncrypted(wallet)) {
    yield put(actions.modals.showModal('SecondPassword', { purposes }))
    let { canceled, response } = yield race({
      response: take(actionTypes.wallet.SUBMIT_SECOND_PASSWORD),
      canceled: take(actionTypes.modals.CLOSE_MODAL)
    })
    if (canceled) {
      throw new Error('PROMPT_FOR_SEC_PW_CANCEL')
    } else {
      return response.payload.password
    }
  }
}

export const promptForInput = function * ({
  title,
  secret = false,
  initial = '',
  maxLength,
  validations = []
}) {
  yield put(
    actions.modals.showModal('PromptInput', {
      title,
      secret,
      initial,
      maxLength,
      validations
    })
  )
  let { canceled, response } = yield race({
    response: take(actionTypes.wallet.SUBMIT_PROMPT_INPUT),
    canceled: take(actionTypes.modals.CLOSE_MODAL)
  })
  if (canceled) {
    throw new Error('PROMPT_INPUT_CANCEL')
  } else {
    yield put(actions.modals.closeModal())
    return response.payload.value
  }
}

export const confirm = function * ({
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
      title,
      message,
      image,
      confirm,
      nature,
      cancel,
      messageValues
    })
  )
  let { canceled, response } = yield race({
    response: take(actionTypes.wallet.SUBMIT_CONFIRMATION),
    canceled: take(actionTypes.modals.CLOSE_MODAL)
  })
  if (canceled) {
    throw new Error('CONFIRM_CANCELED')
  } else {
    yield put(actions.modals.closeModal())
    return response.payload.value
  }
}
