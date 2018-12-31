import { put } from 'redux-saga/effects'
import * as A from './actions'

export default ({ api, options }) => {
  return function* coreWalletOptionsSaga () {
    yield put(A.fetchOptionsSuccess(options))
  }
}
