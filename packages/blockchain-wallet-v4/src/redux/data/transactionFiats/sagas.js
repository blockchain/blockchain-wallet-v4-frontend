import { call, put, select } from 'redux-saga/effects'
import { prop, compose } from 'ramda'

import * as A from './actions'
import { getCurrency } from '../../settings/selectors'

export const transactionFiats = ({ api, walletPath, dataPath, settingsPath } = {}) => {
  const fetchTransactionFiatAtTime = function * ({ coin, hash, amount, time }) {
    const currency = yield select(compose(getCurrency, prop(settingsPath)))
    const data = yield call(api.getTransactionFiatAtTime, coin, amount, currency, time)
    yield put(A.setTransactionFiatAtTime(coin, currency, hash, data))
  }

  return {
    fetchTransactionFiatAtTime
  }
}
