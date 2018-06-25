import { put, fork, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as actions from '../actions'
import * as Types from '../../types'

export default () => {
  const generateAddressLabels = function * ({payload}) {
    yield fork(generateAddressesNonBlocking, payload)
  }

  const generateAddressesNonBlocking = function * (payload) {
    yield call(delay, 4000)
    const accounts = Types.Wallet.selectHDAccounts(payload.wallet)

    let addressLabels = accounts.map((account) => {
      const hd = accounts.get(account.index)
      return account.address_labels.map((label) => ({
        address: Types.HDAccount.getReceiveAddress(hd, label.index),
        label: label.label,
        index: label.index
      }))
    }).flatten().toArray()

    for (let i in addressLabels) {
      yield put(actions.data.bitcoin.addAddressLabel(addressLabels[i].address, addressLabels[i].label))
    }
  }

  return {
    generateAddressLabels
  }
}
