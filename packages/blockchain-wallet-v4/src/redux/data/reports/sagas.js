import { call, put, select } from 'redux-saga/effects'
import { prop, compose } from 'ramda'

import * as AT from './actions'
import { Wrapper, Wallet } from '../../../types'
import { getCurrency } from '../../settings/selectors'

export const reports = ({ api, walletPath, dataPath, settingsPath } = {}) => {
  const fetchTransactionHistory = function * ({ address, start, end }) {
    const currency = yield select(compose(getCurrency, prop(settingsPath)))
    if (address) {
      const response = yield call(api.getTransactionHistory, address, currency, start, end)
      yield put(AT.setTransactionHistory(response))
    } else {
      const context = yield select(compose(Wallet.selectContext, Wrapper.selectWallet, prop(walletPath)))
      const active = context.toJS().join('|')
      const response = yield call(api.getTransactionHistory, active, currency, start, end)
      yield put(AT.setTransactionHistory(response))
    }
  }

  return {
    fetchTransactionHistory
  }
}
