import { select } from 'redux-saga'
import * as S from '../../selectors'

// TODO: Better way to test that ?
export const isValidIndex = function * (index) {
  const accounts = yield select(S.kvStore.ethereum.getAccounts)
  return index >= 0 && index <= length(accounts.getOrElse([]))
}
