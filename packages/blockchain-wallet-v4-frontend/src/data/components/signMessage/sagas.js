import { put, call, select } from 'redux-saga/effects'
import * as A from './actions.js'
import * as actions from '../../actions.js'
import * as selectors from '../../selectors.js'

import { promptForSecondPassword } from 'services/SagaService'
import { Types } from 'blockchain-wallet-v4/src'
import * as signer from 'blockchain-wallet-v4/src/signer'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ coreSagas }) => {
  const logLocation = 'components/signMessage/sagas'

  const signMessage = function * (action) {
    try {
      const { addr, message } = action.payload
      const password = yield call(promptForSecondPassword)
      const wallet = yield select(selectors.core.wallet.getWallet)
      const signedT = Types.Wallet.getPrivateKeyForAddress(wallet, password, addr)
        .map(priv => signer.btc.signMessage(priv, message))
      const signed = yield call(() => taskToPromise(signedT))
      yield put(A.messageSigned(signed))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'signMessage', e))
      yield put(actions.alerts.displayError('Failed to sign message.'))
    }
  }

  return {
    signMessage
  }
}
