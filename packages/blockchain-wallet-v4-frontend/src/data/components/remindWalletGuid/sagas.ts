import { call, put } from 'redux-saga/effects'

import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { actions } from 'data'

export default ({ api }: { api: APIType }) => {
  const remindWalletGuid = function* (action) {
    try {
      const { captchaToken, email } = action.payload
      yield put(actions.components.remindWalletGuid.remindLoading())
      const sessionToken = yield call(api.obtainSessionToken)
      yield call(api.remindGuid, email, captchaToken, sessionToken)
      yield put(actions.components.remindWalletGuid.remindSuccess())
    } catch (e) {
      yield put(actions.components.remindWalletGuid.remindFailure(e))
    }
  }

  return {
    remindWalletGuid
  }
}
