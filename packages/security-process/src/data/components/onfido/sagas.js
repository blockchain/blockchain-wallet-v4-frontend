import { put, call, select } from 'redux-saga/effects'
import { actions } from 'data'
import * as A from './actions'
import * as S from './selectors'
export const logLocation = 'components/identityVerification/sagas'
export default ({ api }) => {
  const fetchOnfidoSDKKey = function * () {
    try {
      yield put(A.fetchOnfidoSDKKeyLoading())
      const { token, applicantId } = yield call(api.fetchOnfidoSDKKey)
      yield put(A.setOnfidoApplicantId(applicantId))
      yield put(A.fetchOnfidoSDKKeySuccess(token))
    } catch (error) {
      yield put(A.fetchOnfidoSDKKeyError(error))
    }
  }
  const syncOnfido = function * ({ payload }) {
    try {
      const { isSelfie } = payload
      const applicantId = yield select(S.getApplicantId)
      yield put(A.syncOnfidoLoading())
      yield call(api.syncOnfido, applicantId, isSelfie)
      yield put(A.syncOnfidoSuccess())
      yield put(actions.modules.profile.fetchUser())
      yield put(actions.modals.closeAllModals())
      yield put(actions.router.push('/swap'))
    } catch (error) {
      yield put(A.syncOnfidoError(error))
    }
  }
  return {
    fetchOnfidoSDKKey,
    syncOnfido
  }
}
