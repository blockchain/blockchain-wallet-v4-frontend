import { call, fork, put, select, spawn } from 'redux-saga/effects'

import * as A from './actions'
import * as actions from '../../actions'
import { selectors } from '../../index'
import settings from 'config'
import { Remote, Types } from 'blockchain-wallet-v4/src'

export default ({ api }) => {
  const toggleUsedAddresses = function * () {
    yield put(actions.modals.closeAllModals())
    //yield spawn(fetchUsedAddresses, {}, '0')
  }

  const deriveAddresses = function * (account) {
    let i = 0
    let t = []

    while (i <= 5) { //receiveIndex.data
      console.log(i)
      t.push(Types.HDAccount.getReceiveAddressFast(account, i, settings.NETWORK_BITCOIN))
      i++
    }

    return t
  }

  const fetchUsedAddresses = function * (action, walletId) {
    const walletIndex = action.payload ? action.payload.walletIndex : walletId
    yield put(A.fetchUsedAddressesLoading(walletIndex))
    const wallet = yield select(selectors.core.wallet.getWallet)
    const account = Types.Wallet.selectHDAccounts(wallet).get(walletIndex)
    const labels = Types.HDAccount.selectAddressLabels(account).reverse().toArray()
    const receiveIndex = yield select(selectors.core.data.bitcoin.getReceiveIndex(account.xpub))
    const addressList = yield call(deriveAddresses, account)
    const addressesInfo = yield call(api.fetchBlockchainData, addressList)
    yield put(A.fetchUsedAddressesSuccess(walletIndex, addressesInfo.addresses))
  }

  return {
    fetchUsedAddresses,
    toggleUsedAddresses
  }
}
