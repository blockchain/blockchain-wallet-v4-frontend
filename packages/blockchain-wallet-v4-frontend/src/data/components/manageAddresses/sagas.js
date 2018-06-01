import { call, put, select } from 'redux-saga/effects'
import { ascend, filter, findIndex, forEach, pluck, prop, propEq, sort, sortBy } from 'ramda'

import * as A from './actions'
import * as actions from '../../actions'
import { selectors } from '../../index'
import settings from 'config'
import { Types } from 'blockchain-wallet-v4/src'

export default ({ api }) => {
  const logLocation = 'components/manageAddresses/sagas'

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

  const generateNextReceiveAddress = function * (action) {
    const { walletIndex } = action.payload
    try {
      yield put(A.generateNextReceiveAddressLoading(walletIndex))
      const wallet = yield select(selectors.core.wallet.getWallet)
      const account = Types.Wallet.selectHDAccounts(wallet).get(walletIndex)
      const labels = Types.HDAccount.selectAddressLabels(account).reverse().toArray()
      const receiveIndex = yield select(selectors.core.data.bitcoin.getReceiveIndex(account.xpub))
      const lastLabeledIndex = labels.reduce((acc, l) => Math.max(acc, l.index), 0)
      yield put(actions.core.wallet.setHdAddressLabel(account.index, Math.max(receiveIndex.data, lastLabeledIndex + 1), 'New Address'))
      yield put(A.fetchUnusedAddresses(walletIndex))
      yield put(A.generateNextReceiveAddressSuccess(walletIndex))
    } catch (e) {
      yield put(A.generateNextReceiveAddressError(walletIndex, e))
      yield put(actions.logs.logErrorMessage(logLocation, 'generateNextReceiveAddress', e))
      yield put(actions.alerts.displayError('Failed to generate new address.'))
    }
  }

  const fetchUnusedAddresses = function * (action) {
    const { walletIndex } = action.payload

    try {
      yield put(A.fetchUnusedAddressesLoading(walletIndex))
      const wallet = yield select(selectors.core.wallet.getWallet)
      const account = Types.Wallet.selectHDAccounts(wallet).get(walletIndex)
      const labels = Types.HDAccount.selectAddressLabels(account).reverse().toArray()
      const labeledAddrs = labels.map(la => ({
        address: Types.HDAccount.getReceiveAddress(account, la.index, settings.NETWORK_BITCOIN), index: la.index, label: la.label
      }))
      const labeledAddrsFull = yield call(api.fetchBlockchainData, pluck('address', labeledAddrs))
      const unusedAddresses = filter(a => a.n_tx === 0, labeledAddrsFull.addresses)

      forEach((labeledAddr) => {
        let idx = findIndex(propEq('address', labeledAddr.address))(unusedAddresses)
        if (idx !== -1) {
          unusedAddresses[idx].derivationIndex = labeledAddr.index
          unusedAddresses[idx].label = labeledAddr.label
        }
      }, labeledAddrs)
      yield put(A.fetchUnusedAddressesSuccess(walletIndex, sort((a, b) => { return a.derivationIndex - b.derivationIndex }, unusedAddresses)))
    } catch (e) {
      yield put(A.fetchUnusedAddressesError(walletIndex, e))
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchUnusedAddresses', e))
      yield put(actions.alerts.displayError('Failed to retrieve unused addresses.'))
    }
  }

  const fetchUsedAddresses = function * (action) {
    const { walletIndex } = action.payload

    try {
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
      const labeledAddrs = labels.map(la => ({
        address: Types.HDAccount.getReceiveAddress(account, la.index, settings.NETWORK_BITCOIN), index: la.index, label: la.label
      }))

      // filter only addresses with tx's
      const usedAddresses = filter(a => a.n_tx > 0, derivedAddrsFull.addresses)

      // match labels with addresses
      forEach((labeledAddr) => {
        let idx = findIndex(propEq('address', labeledAddr.address))(usedAddresses)
        if (idx !== -1) {
          usedAddresses[idx].label = labeledAddr.label
        }
      }, labeledAddrs)

      yield put(A.fetchUsedAddressesSuccess(walletIndex, usedAddresses))
    } catch (e) {
      yield put(A.fetchUsedAddressesError(walletIndex, e))
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchUsedAddresses', e))
      yield put(actions.alerts.displayError('Failed to retrieve used addresses.'))
    }
  }

  return {
    generateNextReceiveAddress,
    fetchUnusedAddresses,
    fetchUsedAddresses,
    toggleUsedAddresses
  }
}
