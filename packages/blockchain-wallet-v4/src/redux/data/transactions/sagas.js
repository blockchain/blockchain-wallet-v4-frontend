import { call, put, select } from 'redux-saga/effects'
import { prop, compose, equals, replace } from 'ramda'

import * as A from './actions'
import { Wrapper, Wallet } from '../../../types'
import { getTransactions, getAddress } from './selectors'
import { getCurrency } from '../../settings/selectors'

export const transactions = ({ api, walletPath, dataPath, settingsPath } = {}) => {
  const fetchTransactions = function * ({ address }) {
    let reset = false
    const context = yield select(compose(Wallet.selectContext, Wrapper.selectWallet, prop(walletPath)))
    const currentAddress = yield select(compose(getAddress, prop(dataPath)))
    const currentTxs = yield select(compose(getTransactions, prop(dataPath)))
    if (!equals(currentAddress, address)) { reset = true }
    const offset = currentTxs.length
    const data = yield call(api.fetchBlockchainData, context.toJS(), { n: 50, onlyShow: address, offset: offset })
    yield put(A.setTransactions(address, data.txs, reset))
  }

  return {
    fetchTransactions
  }
}
