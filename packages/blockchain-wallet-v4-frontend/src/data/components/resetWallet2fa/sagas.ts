import { call, put } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { actions } from 'data'
import miscSagas from 'data/misc/sagas'
import { CaptchaActionName } from 'data/types'

export default ({ api }: { api: APIType }) => {
  const { generateCaptchaToken } = miscSagas()

  const resetWallet2fa = function* (action) {
    try {
      const { formValues } = action.payload
      const { email, guid, newEmail } = formValues
      yield put(actions.components.resetWallet2fa.resetLoading())
      const sessionToken = yield call(api.obtainSessionToken)
      const captchaToken = yield call(generateCaptchaToken, CaptchaActionName.RESET_2FA)
      yield call(api.reset2fa, guid, email, newEmail, captchaToken, sessionToken)
      yield put(actions.components.resetWallet2fa.resetSuccess())
    } catch (e) {
      yield put(actions.components.resetWallet2fa.resetFailure(e.toString()))
    }
  }

  return {
    resetWallet2fa
  }
}
