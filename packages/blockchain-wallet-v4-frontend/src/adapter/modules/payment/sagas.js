import { call, select } from 'redux-saga/effects'
import { has, isNil, prop } from 'ramda'
import { api } from 'services/ApiService'
import { selectors } from 'data'
import { utils } from 'blockchain-wallet-v4/src'
import BigNumber from 'bignumber.js'

const buildBchTransaction = function * () {

}

const buildBtcTransaction = function * (source, targetAddress, amount, feePerByte) {
  if (!has('address', source) && !has('index', source)) throw new Error('buildBtcTransaction(): Invalid source.')
  if (isNil(targetAddress) || !utils.bitcoin.isValidBitcoinAddress(targetAddress)) throw new Error('buildBtcTransaction(): Invalid targetAddress.')
  const sourceAddress = prop('address', source) || prop('index', source)
  // const wrapper = yield select(selectors.core.wallet.getWrapper)
  // if (isNil(wrapper)) throw new Error('buildBtcTransaction(): Invalid wrapper.')
  const coins = yield call(api.getWalletUnspents, wrapper, sourceAddress)
  if (isNil(coins)) throw new Error('buildBtcTransaction(): Invalid coins.')
  const changeAddress = yield call(selectChangeAddress, source)
  const selection = utils.bitcoin.calculateSelection(amount, coins, feePerByte, targetAddress, changeAddress)
  const fee = prop('fee', selection)
  const total = new BigNumber(fee).plus(new BigNumber(amount)).toString()

  return {
    source: '',
    target: targetAddress,
    amount,
    fee,
    total,
    payment: selection
  }
}

const buildEthTransaction = function * () {

}

const pushBchTransaction = function * () {

}

const pushBtcTransaction = function * () {

}

const pushEthTransaction = function * () {

}

export default {
  buildBchTransaction,
  buildBtcTransaction,
  buildEthTransaction,
  publishBchTransaction,
  pushBtcTransaction,
  pushEthTransaction
}
