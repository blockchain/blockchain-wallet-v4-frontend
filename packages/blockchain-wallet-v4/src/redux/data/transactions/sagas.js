import { call, put, select } from 'redux-saga/effects'
import { prop, compose, equals } from 'ramda'

import * as A from './actions'
import * as S from './selectors'
import { Wrapper, Wallet } from '../../../types'

export const transactions = ({ api, walletPath, dataPath, settingsPath } = {}) => {
  const fetchBitcoinTransactions = function * ({ address }) {
    let reset = false
    const context = yield select(compose(Wallet.selectContext, Wrapper.selectWallet, prop(walletPath)))
    const currentAddress = yield select(compose(S.getBitcoinAddress, prop(dataPath)))
    const currentTxs = yield select(compose(S.getBitcoinTransactions, prop(dataPath)))
    if (!equals(currentAddress, address)) { reset = true }
    const offset = currentTxs.length
    const data = yield call(api.fetchBlockchainData, context.toJS(), { n: 50, onlyShow: address, offset: offset })
    console.log(data)
    yield put(A.setBitcoinTransactions(address, data.txs, reset))
  }

  const fetchEthereumTransactions = function * ({ address }) {
    console.log('fetchEthereumTransactions')
  }

  return {
    fetchBitcoinTransactions,
    fetchEthereumTransactions
  }
}
