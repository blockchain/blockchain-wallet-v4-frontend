import { call } from 'redux-saga/effects'

import { getKeyPair } from '../utils/xlm'

export const sign = function* ({ transaction }, mnemonic) {
  const keyPair = yield call(getKeyPair, mnemonic)
  transaction.sign(keyPair)
  return transaction
}
