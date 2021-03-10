import { select } from 'redux-saga/effects'

import * as S from '../../selectors'

// TODO: Better way to test that ?
export const isValidIndex = function * (index) {
  const accounts = yield select(S.kvStore.eth.getAccounts)
  return index >= 0 && index <= length(accounts.getOrElse([]))
}
