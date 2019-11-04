import * as A from './actions'
import { put } from 'redux-saga/effects'

export default ({ api, options }) => {
  return function * coreWalletOptionsSaga () {
    yield put(A.fetchOptionsSuccess(options))
  }
}
