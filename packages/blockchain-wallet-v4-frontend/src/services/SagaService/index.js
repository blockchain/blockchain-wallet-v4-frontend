import { call, put, select, take, race } from 'redux-saga/effects'
import { assoc } from 'ramda'
import { Types } from 'blockchain-wallet-v4'
import { actions, actionTypes, selectors } from 'data'

export const promptForSecondPassword = function * () {
  const wallet = yield select(selectors.core.wallet.getWallet)
  if (Types.Wallet.isDoubleEncrypted(wallet)) {
    yield put(actions.modals.showModal('SecondPassword'))
    const secPassAct = yield take(actionTypes.wallet.SUBMIT_SECOND_PASSWORD)
    return secPassAct.payload.password
  }
}

export const askSecondPasswordEnhancer = (coreSaga) => function * (args) {
  let secPass = yield call(promptForSecondPassword)
  let enhancedArgs = assoc('password', secPass, args)
  yield call(coreSaga, enhancedArgs)
}

export const promptForInput = function * ({ title, secret, initial = '' }) {
  yield put(actions.modals.showModal('PromptInput', { title, secret, initial }))
  let { response, canceled } = yield race({
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

export const forceSyncWallet = function * () {
  yield put(actions.core.walletSync.forceSync())
  const { error } = yield race({
    success: take(actionTypes.core.walletSync.SYNC_SUCCESS),
    error: take(actionTypes.core.walletSync.SYNC_ERROR)
  })
  if (error) {
    throw new Error('Sync failed')
  }
}
