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

  const deriveAddresses = function(account, receiveIndex, derivation) {
    let i = 0
    let addrs = []

    while (i <= receiveIndex) {
      addrs.push(
        Types.HDAccount.getReceiveAddress(account, i, networks.btc, derivation)
      )
      i++
    }

    return addrs
  }

  const generateNextReceiveAddress = function * (action) {
    const { derivation, walletIndex } = action.payload
    try {
      yield put(A.generateNextReceiveAddressLoading(walletIndex, derivation))
      const wrapper = yield select(selectors.core.wallet.getWrapper)
      const wallet = yield select(selectors.core.wallet.getWallet)
      const account = Types.Wallet.selectHDAccounts(wallet).get(walletIndex)
      const nextReceiveIndex = yield select(
        selectors.core.common.btc.getNextAvailableReceiveIndex(
          networks.btc,
          account.index,
          derivation
        )
      )
      yield put(
        actions.core.wallet.setHdAddressLabel(
          account.index,
          nextReceiveIndex.getOrElse(0),
          derivation,
          'New Address',
          // TODO: SEGWIT remove w/ DEPRECATED_V3
          wrapper.version
        )
      )
      yield put(A.fetchUnusedAddresses(walletIndex, derivation))
      yield put(A.generateNextReceiveAddressSuccess(walletIndex, derivation))
    } catch (e) {
      yield put(A.generateNextReceiveAddressError(walletIndex, derivation, e))
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
    const { derivation, walletIndex } = action.payload

    try {
      yield put(A.fetchUnusedAddressesLoading(walletIndex, derivation))
      const wallet = yield select(selectors.core.wallet.getWallet)
      const account = Types.Wallet.selectHDAccounts(wallet).get(walletIndex)
      // get all indexes for labeled addresses
      const labels = Types.HDAccount.selectAddressLabels(account, derivation)
        .reverse()
        .toArray()
      // derive addresses from label indexes
      const labeledAddrs = labels.map(la => ({
        address: Types.HDAccount.getReceiveAddress(
          account,
          la.index,
          networks.btc,
          derivation
        ),
        index: la.index,
        label: la.label
      }))
      // fetch blockchain data for each address
      const labeledAddrsFull = yield call(api.fetchBlockchainData, {
        addresses: pluck('address', labeledAddrs)
      })
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
          derivation,
          sort((a, b) => {
            return b.derivationIndex - a.derivationIndex
          }, unusedAddresses)
        )
      )
    } catch (e) {
      yield put(A.fetchUnusedAddressesError(walletIndex, derivation, e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'fetchUnusedAddresses', e)
      )
      yield put(actions.alerts.displayError(C.FETCH_UNUSED_ADDRESSES_ERROR))
    }
  }

  const fetchUsedAddresses = function * (action) {
    const { derivation, walletIndex } = action.payload

    try {
      yield put(A.fetchUsedAddressesLoading(walletIndex, derivation))
      const wallet = yield select(selectors.core.wallet.getWallet)
      const account = Types.Wallet.selectHDAccounts(wallet).get(walletIndex)
      let xpub = Types.HDAccount.selectXpub(account, derivation)
      // get current receive index of wallet
      const receiveIndex = yield select(
        selectors.core.data.btc.getReceiveIndex(xpub)
      )
      // derive previous addresses
      const derivedAddrs = yield call(
        deriveAddresses,
        account,
        receiveIndex.getOrElse(0),
        derivation
      )
      // fetch blockchain data for each address
      const derivedAddrsFull = yield call(api.fetchBlockchainData, {
        addresses: derivedAddrs
      })
      // fetch label indexes and derive those addresses
      const labels = Types.HDAccount.selectAddressLabels(account, derivation)
        .reverse()
        .toArray()
      const labeledAddrs = labels.map(la => ({
        address: Types.HDAccount.getReceiveAddress(
          account,
          la.index,
          networks.btc,
          derivation
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

      yield put(
        A.fetchUsedAddressesSuccess(walletIndex, derivation, usedAddresses)
      )
    } catch (e) {
      yield put(A.fetchUsedAddressesError(walletIndex, derivation, e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'fetchUsedAddresses', e)
      )
      yield put(actions.alerts.displayError(C.FETCH_USED_ADDRESSES_ERROR))
    }
  }

  const editAddressLabel = function * (action) {
    const {
      accountIndex,
      addressIndex,
      derivation,
      walletIndex
    } = action.payload
    try {
      const wrapper = yield select(selectors.core.wallet.getWrapper)
      yield put(A.editAddressLabelLoading(accountIndex, derivation))
      let newLabel = yield call(promptForInput, {
        title: 'Rename Address Label',
        maxLength: 50
      })
      yield put(
        actions.core.wallet.setHdAddressLabel(
          accountIndex,
          addressIndex,
          derivation,
          newLabel,
          // TODO: SEGWIT remove w/ DEPRECATED_V3
          wrapper.version
        )
      )
      yield put(A.fetchUnusedAddresses(walletIndex, derivation))
      yield put(A.editAddressLabelSuccess(walletIndex, derivation))
      yield put(actions.alerts.displaySuccess(C.UPDATE_ADDRESS_LABEL_SUCCESS))
    } catch (e) {
      if (e.message !== 'PROMPT_INPUT_CANCEL') {
        yield put(A.editAddressLabelError(walletIndex, derivation, e))
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
    const { accountIdx, addressIdx, derivation, walletIdx } = action.payload

    try {
      const wrapper = yield select(selectors.core.wallet.getWrapper)
      yield put(A.deleteAddressLabelLoading(accountIdx, derivation))
      yield call(
        function * () {
          yield put(
            actions.core.wallet.deleteHdAddressLabel(
              accountIdx,
              addressIdx,
              derivation,
              // TODO: SEGWIT remove w/ DEPRECATED_V3
              wrapper.version
            )
          )
        },
        accountIdx,
        addressIdx
      )
      yield put(A.deleteAddressLabelSuccess(walletIdx, derivation))
      yield put(A.fetchUnusedAddresses(walletIdx, derivation))
      yield put(actions.alerts.displaySuccess(C.ADDRESS_DELETE_SUCCESS))
    } catch (e) {
      yield put(A.deleteAddressLabelError(walletIdx, derivation, e))
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
