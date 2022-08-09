import { call, put, take } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { ExtraKYCContext } from '@core/types'
import { actions } from 'data'
import { VerifyIdentityOriginType } from 'data/types'

export const getExtraKYCCompletedStatus = function* ({
  api,
  context,
  origin
}: {
  api: APIType
  context: ExtraKYCContext
  origin: VerifyIdentityOriginType
}): any {
  const hasPendingQuestions = yield call(api.fetchKYCExtraQuestions, context)
  if (hasPendingQuestions) {
    yield put(
      actions.components.identityVerification.verifyIdentity({
        context,
        needMoreInfo: false,
        origin,
        tier: 1
      })
    )

    // Wait for KYC flow to end
    const { type } = yield take([
      actions.components.identityVerification.kycModalClosed.type,
      actions.components.identityVerification.setAllContextQuestionsAnswered.type
    ])

    // If KYC was closed before answering, return
    if (type === actions.components.identityVerification.kycModalClosed.type) return false
  }

  return true
}
