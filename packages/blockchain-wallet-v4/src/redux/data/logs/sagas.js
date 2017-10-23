import { call, put, select } from 'redux-saga/effects'
import { compose, prop } from 'ramda'
import { Wallet, Wrapper } from '../../../types'

import * as A from './actions'

export const logs = ({ api, walletPath } = {}) => {
  const fetchLogs = function * () {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const response = yield call(api.getLogs, guid, sharedKey)
    yield put(A.setLogs(response.results))
  }

  return {
    fetchLogs
  }
}
