import { put } from 'redux-saga/effects'

import * as A from './actions'

export default ({ options }) => {
  return function * coreWalletOptionsSaga() {
    yield put(A.fetchOptionsSuccess(options))
  }
}
