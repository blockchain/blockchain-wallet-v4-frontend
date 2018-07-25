import { put, call, select } from 'redux-saga/effects'
import { actions } from 'data'

import * as A from './actions'
import * as S from './selectors'

export const logLocation = 'components/identityVerification/sagas'

export default ({ api }) => {
  const fetchOnfidoSDKKey = function*() {
    try {
      yield put(A.fetchOnfidoSDKKeyLoading())
      const { message: key, applicantId } = yield call(api.fetchOnfidoSDKKey)
      yield put(A.setOnfidoApplicantId(applicantId))
      yield put(A.fetchOnfidoSDKKeySuccess(key))
    } catch (error) {
      yield put(A.fetchOnfidoSDKKeyError(error))
    }
  }

  const syncOnfido = function*() {
    try {
      const applicantId = yield select(S.getApplicantId)
      yield put(A.syncOnfidoLoading())
      yield call(api.syncOnfido, applicantId)
      yield put(A.syncOnfidoSuccess())
      yield put(actions.modals.closeModal())
    } catch (error) {
      yield put(A.syncOnfidoError(error))
    }
  }

  return {
    fetchOnfidoSDKKey,
    syncOnfido
  }
}
