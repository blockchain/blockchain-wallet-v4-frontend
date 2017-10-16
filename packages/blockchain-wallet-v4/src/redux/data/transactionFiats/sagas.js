import { call, put, select } from 'redux-saga/effects'
import { prop, compose, head } from 'ramda'

import * as A from './actions'
import { getCurrency } from '../../settings/selectors'
import { getTransactions } from '../transactions/selectors'

export const transactionFiatsSaga = ({ api, walletPath, dataPath, settingsPath } = {}) => {
  const fetchTransactionFiatAtTime = function * ({ coin, hash }) {
    const currency = yield select(compose(getCurrency, prop(settingsPath)))
    const transactions = yield select(compose(getTransactions, prop(dataPath)))
    const transaction = head(transactions.filter(x => x.hash === hash))
    const amount = transaction.result
    const time = transaction.time * 1000
    const data = yield call(api.getTransactionFiatAtTime, coin, amount, currency, time)
    yield put(A.setTransactionFiatAtTime(coin, currency, hash, data))
  }

  return {
    fetchTransactionFiatAtTime
  }
}
