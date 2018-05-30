import { call, put, select } from 'redux-saga/effects'

import * as A from './actions'
import * as actions from '../../actions'
import { selectors } from '../../index'
import settings from 'config'
import { Types } from 'blockchain-wallet-v4/src'

export default ({ api }) => {
  const toggleUsedAddresses = function * () {
    yield put(actions.modals.closeAllModals())
  }

  const deriveAddresses = function * (account, receiveIndex) {
    let i = 0
    let t = []

    while (i <= receiveIndex.data) {
      console.log(i)
      t.push(Types.HDAccount.getReceiveAddress(account, i, settings.NETWORK_BITCOIN))
      i++
    }

    return t
  }

  const fetchUsedAddresses = function * (action) {
    const { walletIndex } = action.payload
    yield put(A.fetchUsedAddressesLoading(walletIndex))
    const wallet = yield select(selectors.core.wallet.getWallet)
    const account = Types.Wallet.selectHDAccounts(wallet).get(walletIndex)
    // get current receive index
    const receiveIndex = yield select(selectors.core.data.bitcoin.getReceiveIndex(account.xpub))
    // derive old addresses
    const derivedAddrs = yield call(deriveAddresses, account, receiveIndex)
    // fetch blockchain data for each address
    const derivedAddrsFull = yield call(api.fetchBlockchainData, derivedAddrs)
    // fetch label indexes and derive addresses
    const labels = Types.HDAccount.selectAddressLabels(account).reverse().toArray()
    const labeledAddrs = labels.map(l => {
      return {
        address: Types.HDAccount.getReceiveAddress(account, l.index, settings.NETWORK_BITCOIN),
        index: l.index,
        label: l.label
      }
    })

    // return only addresses with tx's
    const usedAddresses = derivedAddrsFull.addresses.filter(a => {
      return a.n_tx > 0
    })

    yield put(A.fetchUsedAddressesSuccess(walletIndex, usedAddresses))
  }

  return {
    fetchUsedAddresses,
    toggleUsedAddresses
  }
}
