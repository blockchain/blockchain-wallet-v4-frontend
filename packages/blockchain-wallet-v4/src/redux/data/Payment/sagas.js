import { call, put, select } from 'redux-saga/effects'
import * as A from './actions'
import { getCoins } from '../payment/selectors.js'
import { prop, is, compose } from 'ramda'
import { sign } from '../../../signer'
import { futurizeP } from 'futurize'
import Task from 'data.task'
import * as Coin from '../../../coinSelection/coin'
import * as CoinSelection from '../../../coinSelection'
// import { CoinSelection } from '../../coinSelection'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const paymentSaga = ({ api, walletPath, dataPath } = {}) => {
  const getUnspent = function * (index, address) {
    const source = is(Number, index) ? index : address
    const wrapper = yield select(prop(walletPath))
    try {
      const coins = yield call(api.getWalletUnspents, wrapper, source)
      yield put(A.setUnspent(coins))
    } catch (e) {
      yield put(A.setUnspent([]))
      throw e
    }
  }

  const refreshSelection = function * (feePerByte, changeAddress, receiveAddress, satoshis, algorithm, seed) {
    const coins = yield select(compose(getCoins, prop(dataPath)))
    const targetCoin = Coin.fromJS({ address: receiveAddress, value: satoshis })
    yield put(A.setSelection(feePerByte, targetCoin, coins, changeAddress, algorithm, seed))
  }

  const refreshEffectiveBalance = function * (feePerByte) {
    const coins = yield select(compose(getCoins, prop(dataPath)))
    const effectiveBalance = CoinSelection.effectiveBalance(feePerByte, coins).value
    yield put(A.setEffectiveBalance(effectiveBalance))
  }

  const signAndPublish = function * (action) {
    const { network, selection, secondPassword } = action.payload
    const wrapper = yield select(prop(walletPath))
    const signAndPublish = (sel, pass) =>
      taskToPromise(sign(network, pass, wrapper, sel).chain(futurizeP(Task)(api.pushTx)))
    return yield call(signAndPublish, selection, secondPassword)
  }

  return {
    getUnspent,
    refreshSelection,
    refreshEffectiveBalance,
    signAndPublish
  }
}
