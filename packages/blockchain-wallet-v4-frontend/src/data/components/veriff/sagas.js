import { call, put, select } from 'redux-saga/effects'

import { actions, model } from 'data'
import profileSagas from 'data/modules/profile/sagas'
import * as A from './actions'
import * as S from './selectors'

export const logLocation = 'components/veriff/sagas'

export default ({ api, coreSagas }) => {
  const { COMPLETE } = model.analytics.KYC
  const { fetchUser } = profileSagas({ api, coreSagas })

  const fetchVeriffUrl = function*() {
    try {
      yield put(A.fetchVeriffUrlLoading())
      const {
        data: { url },
        applicantId
      } = yield call(api.fetchVeriffUrl)
      yield put(A.setApplicantId(applicantId))
      yield put(A.fetchVeriffUrlSuccess(url))
    } catch (error) {
      yield put(A.fetchVeriffUrlError(error))
    }
  }

  const syncVeriff = function*() {
    try {
      const applicantId = yield select(S.getApplicantId)
      yield call(api.syncVeriff, applicantId)
      yield call(fetchUser)
      yield put(actions.modals.closeAllModals())
      yield put(actions.router.push('/swap'))
      yield put(actions.analytics.logEvent(COMPLETE))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'syncVeriff', e))
    }
  }

  return {
    fetchVeriffUrl,
    syncVeriff
  }
}
