import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as A from './actions.js'
import * as actions from '../../actions.js'
import * as selectors from '../../selectors.js'

import { promptForSecondPassword } from 'services/SagaService'
import { Types } from 'blockchain-wallet-v4/src'
import * as signer from 'blockchain-wallet-v4/src/signer'

export default ({ coreSagas }) => {
  const signMessage = function * (action) {
    try {
      const { addr, message } = action.payload
      const password = yield call(promptForSecondPassword)
      const wallet = yield select(selectors.core.wallet.getWallet)
      const priv = Types.Wallet.getPrivateKeyForAddress(wallet, password, addr)
      if (priv.isRight) {
        const signed = signer.btc.signMessage(priv.value, message)
        yield put(A.messageSigned(signed))
      } else {
        yield put(actions.alerts.displayError('Could sign message: private key error.'))
      }
    } catch (e) {
      yield put(actions.alerts.displayError('Could sign message.'))
    }
  }

  return function * () {
    yield takeLatest(AT.SIGN_MESSAGE_SUBMITTED, signMessage)
  }
}
