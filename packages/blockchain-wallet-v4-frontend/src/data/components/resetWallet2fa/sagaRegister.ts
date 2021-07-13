import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import resetWallet2faSagas from './sagas'

export default ({ api }) => {
  const sagas = resetWallet2faSagas({ api })

  return function* resetWallet2faSagas() {
    yield takeLatest(AT.RESET_WALLET_2FA, sagas.resetWallet2fa)
  }
}
