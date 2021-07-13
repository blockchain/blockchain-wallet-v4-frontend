import { call, put } from 'redux-saga/effects'

import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { actions } from 'data'

export default ({ api }: { api: APIType }) => {
  const resetWallet2fa = function* (action) {
    try {
      const { captchaToken, formValues } = action.payload
      const { email, guid, newEmail } = formValues
      yield put(actions.components.resetWallet2fa.resetLoading())
      const sessionToken = yield call(api.obtainSessionToken)
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
