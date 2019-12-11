import * as A from './actions.js'
import * as actions from '../../actions.js'
import { put } from 'redux-saga/effects'
import { signMessage as sign } from 'blockchain-wallet-v4/src/signer/btc'

export default ({ coreSagas }) => {
  const logLocation = 'components/bchSignMessage/sagas'

  const signMessage = function * (action) {
    try {
      // TODO: handle second password
      const { addr, priv, message } = action.payload
      // sign message with private key
      const signed = yield sign(priv, addr, message)
      yield put(A.messageSigned(signed))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'signedMessageBch'))
      // TODO: display error message
    }
  }

  return {
    signMessage
  }
}
