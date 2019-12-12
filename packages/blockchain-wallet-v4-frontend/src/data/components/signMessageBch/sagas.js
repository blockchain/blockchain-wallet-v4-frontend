import * as A from './actions.js'
import * as actions from '../../actions.js'
import * as C from 'services/AlertService'
import { put } from 'redux-saga/effects'
import { signMessage as sign } from 'blockchain-wallet-v4/src/signer/btc'

export default ({ coreSagas }) => {
  const logLocation = 'components/signMessageBch/sagas'

  const signMessage = function * (action) {
    try {
      const { addr, priv, message } = action.payload
      const signed = yield sign(priv, addr, message)
      yield put(A.messageSigned(signed))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'signMessage', error))
      yield put(actions.alerts.displayError(C.MESSAGE_SIGN_ERROR))
    }
  }

  return {
    signMessage
  }
}
