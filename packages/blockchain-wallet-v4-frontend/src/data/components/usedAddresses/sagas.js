import { call, put, select } from 'redux-saga/effects'
import { filter, findIndex, forEach, propEq } from 'ramda'

import * as A from './actions'
import * as actions from '../../actions'
import { selectors } from '../../index'
import settings from 'config'
import { Types } from 'blockchain-wallet-v4/src'

export default ({ api }) => {
  const toggleUsedAddresses = function * () {
    yield put(actions.modals.closeAllModals())
  }

  const deriveAddresses = function (account, receiveIndex) {
    let i = 0
    let addrs = []

    while (i <= receiveIndex.data) {
      addrs.push(Types.HDAccount.getReceiveAddress(account, i, settings.NETWORK_BITCOIN))
      i++
    }

    return addrs
  }

  const fetchUsedAddresses = function * (action) {
    const { walletIndex } = action.payload
    yield put(A.fetchUsedAddressesLoading(walletIndex))
    const wallet = yield select(selectors.core.wallet.getWallet)
    const account = Types.Wallet.selectHDAccounts(wallet).get(walletIndex)
    // get current receive index of wallet
    const receiveIndex = yield select(selectors.core.data.bitcoin.getReceiveIndex(account.xpub))
    // derive previous addresses
    const derivedAddrs = yield call(deriveAddresses, account, receiveIndex)
    // fetch blockchain data for each address
    const derivedAddrsFull = yield call(api.fetchBlockchainData, derivedAddrs)
    // fetch label indexes and derive those addresses
    const labels = Types.HDAccount.selectAddressLabels(account).reverse().toArray()
    const labeledAddrs = labels.map(l => {
      return { address: Types.HDAccount.getReceiveAddress(account, l.index, settings.NETWORK_BITCOIN), index: l.index, label: l.label }
    })

    // filter only addresses with tx's
    const usedAddresses = filter(a => a.n_tx > 0, derivedAddrsFull.addresses)

    // match labels with addresses
    if (labeledAddrs.length) {
      forEach((labeledAddr) => {
        let idx = findIndex(propEq('address', labeledAddr.address))(usedAddresses)
        if (idx !== -1) {
          usedAddresses[idx].label = labeledAddr.label
        }
      }, labeledAddrs)
    }

    yield put(A.fetchUsedAddressesSuccess(walletIndex, usedAddresses))
  }

  return {
    fetchUsedAddresses,
    toggleUsedAddresses
  }
}
