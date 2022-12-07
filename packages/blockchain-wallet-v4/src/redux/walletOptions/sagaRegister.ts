import { put } from 'redux-saga/effects'

import { actions } from './slice'

export default ({ options }) => {
  return function* coreWalletOptionsSaga() {
    yield put(actions.fetchOptionsSuccess(options))
  }
}
