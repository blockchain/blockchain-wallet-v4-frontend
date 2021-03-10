import { filter, findIndex, forEach, pluck, propEq, sort } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { Types } from 'blockchain-wallet-v4/src'
import * as C from 'services/alerts'
import { promptForInput } from 'services/sagas'

import * as actions from '../../actions'
import { selectors } from '../../index'
import * as A from './actions'

export default ({ api, networks }) => {
  const logLocation = 'components/manageAddresses/sagas'

  const toggleUsedAddresses = function * () {
    yield put(actions.modals.closeAllModals())
  }

  const deriveAddresses = function(account, receiveIndex) {
    let i = 0
    let addrs = []

    while (i <= receiveIndex) {
      addrs.push(Types.HDAccount.getReceiveAddress(account, i, networks.btc))
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
      const labels = Types.HDAccount.selectAddressLabels(account)
        .reverse()
        .toArray()
      const receiveIndex = yield select(
        selectors.core.data.btc.getReceiveIndex(account.xpub)
      )
      const lastLabeledIndex = labels.reduce(
        (acc, l) => Math.max(acc, l.index),
        0
      )
      yield put(
        actions.core.wallet.setHdAddressLabel(
          account.index,
          Math.max(receiveIndex.getOrElse(0), lastLabeledIndex + 1),
          'New Address'
        )
      )
      yield put(A.fetchUnusedAddresses(walletIndex))
      yield put(A.generateNextReceiveAddressSuccess(walletIndex))
    } catch (e) {
      yield put(A.generateNextReceiveAddressError(walletIndex, e))
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'generateNextReceiveAddress',
          e
        )
      )
      yield put(actions.alerts.displayError(C.NEW_ADDRESS_GENERATE_ERROR))
    }
  }

  const fetchUnusedAddresses = function * (action) {
    const { walletIndex } = action.payload

    try {
      yield put(A.fetchUnusedAddressesLoading(walletIndex))
      const wallet = yield select(selectors.core.wallet.getWallet)
      const account = Types.Wallet.selectHDAccounts(wallet).get(walletIndex)
      // get all indexes for labeled addresses
      const labels = Types.HDAccount.selectAddressLabels(account)
        .reverse()
        .toArray()
      // derive addresses from label indexes
      const labeledAddrs = labels.map(la => ({
        address: Types.HDAccount.getReceiveAddress(
          account,
          la.index,
          networks.btc
        ),
        index: la.index,
        label: la.label
      }))
      // fetch blockchain data for each address
      const labeledAddrsFull = yield call(
        api.fetchBlockchainData,
        pluck('address', labeledAddrs)
      )
      // filter only addresses with 0 txs
      const unusedAddresses = filter(
        a => a.n_tx === 0,
        labeledAddrsFull.addresses
      )

      // map labels back to unused addresses
      forEach(labeledAddr => {
        let idx = findIndex(propEq('address', labeledAddr.address))(
          unusedAddresses
        )
        if (idx !== -1) {
          unusedAddresses[idx].derivationIndex = labeledAddr.index
          unusedAddresses[idx].label = labeledAddr.label
        }
      }, labeledAddrs)

      yield put(
        A.fetchUnusedAddressesSuccess(
          walletIndex,
          sort((a, b) => {
            return b.derivationIndex - a.derivationIndex
          }, unusedAddresses)
        )
      )
    } catch (e) {
      yield put(A.fetchUnusedAddressesError(walletIndex, e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'fetchUnusedAddresses', e)
      )
      yield put(actions.alerts.displayError(C.FETCH_UNUSED_ADDRESSES_ERROR))
    }
  }

  const fetchUsedAddresses = function * (action) {
    const { walletIndex } = action.payload

    try {
      yield put(A.fetchUsedAddressesLoading(walletIndex))
      const wallet = yield select(selectors.core.wallet.getWallet)
      const account = Types.Wallet.selectHDAccounts(wallet).get(walletIndex)
      // get current receive index of wallet
      const receiveIndex = yield select(
        selectors.core.data.btc.getReceiveIndex(account.xpub)
      )
      // derive previous addresses
      const derivedAddrs = yield call(
        deriveAddresses,
        account,
        receiveIndex.getOrElse(0)
      )
      // fetch blockchain data for each address
      const derivedAddrsFull = yield call(api.fetchBlockchainData, derivedAddrs)
      // fetch label indexes and derive those addresses
      const labels = Types.HDAccount.selectAddressLabels(account)
        .reverse()
        .toArray()
      const labeledAddrs = labels.map(la => ({
        address: Types.HDAccount.getReceiveAddress(
          account,
          la.index,
          networks.btc
        ),
        index: la.index,
        label: la.label
      }))

      // filter only addresses with tx's
      const usedAddresses = filter(a => a.n_tx > 0, derivedAddrsFull.addresses)

      // map labels back to used addresses
      forEach(labeledAddr => {
        let idx = findIndex(propEq('address', labeledAddr.address))(
          usedAddresses
        )
        if (idx !== -1) {
          usedAddresses[idx].label = labeledAddr.label
        }
      }, labeledAddrs)

      yield put(A.fetchUsedAddressesSuccess(walletIndex, usedAddresses))
    } catch (e) {
      yield put(A.fetchUsedAddressesError(walletIndex, e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'fetchUsedAddresses', e)
      )
      yield put(actions.alerts.displayError(C.FETCH_USED_ADDRESSES_ERROR))
    }
  }

  const editAddressLabel = function * (action) {
    const { accountIndex, addressIndex, walletIndex } = action.payload
    try {
      yield put(A.editAddressLabelLoading(accountIndex))
      let newLabel = yield call(promptForInput, {
        title: 'Rename Address Label',
        maxLength: 50
      })
      yield put(
        actions.core.wallet.setHdAddressLabel(
          accountIndex,
          addressIndex,
          newLabel
        )
      )
      yield put(A.fetchUnusedAddresses(walletIndex))
      yield put(A.editAddressLabelSuccess(walletIndex))
      yield put(actions.alerts.displaySuccess(C.UPDATE_ADDRESS_LABEL_SUCCESS))
    } catch (e) {
      if (e.message !== 'PROMPT_INPUT_CANCEL') {
        yield put(A.editAddressLabelError(walletIndex, e))
        yield put(
          actions.logs.logErrorMessage(logLocation, 'editAddressLabel', e)
        )
        yield put(actions.alerts.displayError(C.UPDATE_ADDRESS_LABEL_ERROR))
      }
    }
  }

  const editImportedAddressLabel = function * (action) {
    const {
      payload: { address }
    } = action
    try {
      yield put(A.editImportedAddressLabelLoading(address))
      let newLabel = yield call(promptForInput, {
        title: 'Rename Address Label',
        maxLength: 50
      })
      yield put(actions.core.wallet.setLegacyAddressLabel(address, newLabel))
      yield put(A.editImportedAddressLabelSuccess(address))
      yield put(
        actions.alerts.displaySuccess(C.UPDATE_IMPORTED_ADDRESS_LABEL_SUCCESS)
      )
    } catch (e) {
      yield put(A.editImportedAddressLabelError(address, e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'editImportedAddressLabel', e)
      )
      yield put(
        actions.alerts.displayError(C.UPDATE_IMPORTED_ADDRESS_LABEL_ERROR)
      )
    }
  }

  const deleteAddressLabel = function * (action) {
    const { accountIdx, addressIdx, walletIdx } = action.payload

    try {
      yield put(A.deleteAddressLabelLoading(accountIdx))
      yield call(
        function * () {
          yield put(
            actions.core.wallet.deleteHdAddressLabel(
              accountIdx,
              addressIdx,
              walletIdx
            )
          )
        },
        accountIdx,
        addressIdx
      )
      yield put(A.deleteAddressLabelSuccess(walletIdx))
      yield put(A.fetchUnusedAddresses(walletIdx))
      yield put(actions.alerts.displaySuccess(C.ADDRESS_DELETE_SUCCESS))
    } catch (e) {
      yield put(A.deleteAddressLabelError(walletIdx, e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'deleteAddressLabel', e)
      )
      yield put(actions.alerts.displayError(C.ADDRESS_DELETE_ERROR))
    }
  }

  return {
    editAddressLabel,
    generateNextReceiveAddress,
    fetchUnusedAddresses,
    fetchUsedAddresses,
    deleteAddressLabel,
    toggleUsedAddresses,
    editImportedAddressLabel
  }
}
