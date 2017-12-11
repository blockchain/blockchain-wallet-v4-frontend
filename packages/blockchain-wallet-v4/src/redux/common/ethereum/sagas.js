import { call, put, select } from 'redux-saga/effects'
import * as kvStoreEthereumSelectors from '../../kvStore/ethereum/selectors'
import { compose, dissoc, mapObjIndexed, prop, sortBy, sum, values, negate } from 'ramda'
import * as A from './actions'

export const ethereum = ({ api } = {}) => {
  const fetchEthereumData = function * ({ context }) {
    const legacyAccountAddress = yield select(kvStoreEthereumSelectors.getLegacyAccountAddress)
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
    fetchEthereumData
  }
}
