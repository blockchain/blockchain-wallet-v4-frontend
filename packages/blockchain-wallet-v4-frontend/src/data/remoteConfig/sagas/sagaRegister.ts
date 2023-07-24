import { takeLatest } from 'typed-redux-saga'

import { actions } from '../slice'
import { initialize } from './initialize'

export const remoteConfigSaga = function* () {
  yield* takeLatest(actions.initialize, initialize)
}
