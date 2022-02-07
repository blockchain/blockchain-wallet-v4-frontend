import { takeLatest } from 'redux-saga/effects'

import * as saga from './sagas'
import { trackEvent } from './slice'

export default function* analyticsSaga() {
  yield takeLatest(trackEvent.type, saga.trackEvent)
}
