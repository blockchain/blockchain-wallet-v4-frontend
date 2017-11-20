import { call, put, select } from 'redux-saga/effects'
import * as kvStoreEthereumSelectors from '../kvStore/ethereum/selectors'
import { compose, dissoc, indexBy, mapObjIndexed, prop, sortBy, sum, values, negate, path } from 'ramda'
import * as A from './actions'

export const commonSaga = ({ api, kvStorePath } = {}) => {
  const fetchBlockchainData = function * ({ context }) {
    const data = yield call(api.fetchBlockchainData, context, { n: 1 })
    const bitcoinData = {
      addresses: indexBy(prop('address'), prop('addresses', data)),
      info: path(['wallet'], data),
      latest_block: path(['info', 'latest_block'], data)
    }
    yield put(A.setBlockchainData(bitcoinData))
  }

  const fetchEthereumData = function * ({ context }) {
    const legacyAccountAddress = yield select(compose(kvStoreEthereumSelectors.getLegacyAccountAddress, prop(kvStorePath)))
    const data = yield call(api.getEthereumData, context)
    const accounts = dissoc(legacyAccountAddress, data)
    const legacyAccount = prop(legacyAccountAddress, data)
    // Accounts treatments
    const finalBalance = sum(values(accounts).map(obj => obj.balance))
    const totalReceived = sum(values(accounts).map(obj => obj.totalReceived))
    const totalSent = sum(values(accounts).map(obj => obj.totalSent))
    const nTx = sum(values(accounts).map(obj => obj.txn_count))
    const addresses = mapObjIndexed((num, key, obj) => dissoc('txns', num), accounts)
    const transactions = mapObjIndexed((num, key, obj) => sortBy(compose(negate, prop('timeStamp')), prop('txns', num)), accounts)

    const ethereumData = {
      addresses,
      info: {
        n_tx: nTx,
        total_received: totalReceived,
        total_sent: totalSent,
        final_balance: finalBalance
      },
      legacy: legacyAccount,
      transactions
    }
    yield put(A.setEthereumData(ethereumData))
  }

  return {
    fetchBlockchainData,
    fetchEthereumData
  }
}
