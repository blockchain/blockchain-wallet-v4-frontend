import { take, takeEvery, put, call, select } from 'redux-saga/effects'
import {bitcoin} from './../../redux/data/bitcoin/sagas'
import * as selectors from '../../redux/selectors.js'
import {SET_BITCOIN_UNSPENT} from '../../redux/data/bitcoin/actionTypes'
import * as wS from '../../redux/wallet/selectors'
import * as signer from '../../signer'
import * as Bitcoin from 'bitcoinjs-lib'
import {singleRandomDraw} from '../../coinSelection'
// Simple abstraction for creating a signed transaction sending X coins to output Y

export const createApiWallet = api => {
  const btcApi = bitcoin({api})
  const send = function * (outputs, feePerByte) {
    const wrapper = yield select(wS.getWrapper)
    const index = yield select(selectors.wallet.getDefaultAccountIndex)
    const unspents = yield call(btcApi.fetchUnspent, index, undefined)
    const changeAddress = yield select(selectors.common.bitcoin.getNextAvailableChangeAddress(Bitcoin.networks.testnet, index))

    let selection = singleRandomDraw(outputs, feePerByte, unspents, changeAddress, 'a')
    selection.version = 2

    let signed = signer.sign(Bitcoin.networks.testnet, undefined, wrapper, selection)

    let result
    signed.fork(
      (error) => console.info(error),
      (data) => result = data // TODO this looks pretty ugly - maybe return a task instead?
    )
    return result
  }

  const broadcast = function * (tx) {
    yield call(btcApi.pushTx, {payload: {txHex: tx}})
  }

  return {send, broadcast}
}
