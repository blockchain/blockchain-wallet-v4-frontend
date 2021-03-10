import { call, put, select } from 'redux-saga/effects'

import { actions, model } from 'data'
import profileSagas from 'data/modules/profile/sagas.ts'

import * as A from './actions'
import * as S from './selectors'

export const logLocation = 'components/veriff/sagas'

const { STEPS } = model.components.identityVerification

export default ({ api, coreSagas }) => {
  const { fetchUser } = profileSagas({ api, coreSagas })

  const fetchVeriffUrl = function * () {
    try {
      yield put(A.fetchVeriffUrlLoading())
      const {
        applicantId,
        data: { url }
      } = yield call(api.fetchVeriffUrl)
      yield put(A.setApplicantId(applicantId))
      yield put(A.fetchVeriffUrlSuccess(url))
    } catch (error) {
      yield put(A.fetchVeriffUrlError(error))
    }
  }

  const syncVeriff = function * () {
    try {
      const applicantId = yield select(S.getApplicantId)
      yield call(api.syncVeriff, applicantId)
      yield call(fetchUser)
      yield put(
        actions.components.identityVerification.setVerificationStep(
          STEPS.submitted
        )
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'syncVeriff', e))
    }
  }

  return {
    fetchVeriffUrl,
    syncVeriff
  }
}
