import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import remindWalletGuidSagas from './sagas'

export default ({ api }) => {
  const sagas = remindWalletGuidSagas({ api })

  return function* remindWalletGuidSagas() {
    yield takeLatest(AT.REMIND_WALLET_GUID, sagas.remindWalletGuid)
  }
}
