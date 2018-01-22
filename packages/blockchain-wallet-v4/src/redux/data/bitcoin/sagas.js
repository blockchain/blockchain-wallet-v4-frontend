import { call, put, select } from 'redux-saga/effects'
// import { futurizeP } from 'futurize'
// import Task from 'data.task'

import * as A from './actions'
import * as S from './selectors'
// import * as wS from '../../wallet/selectors'
// import { sign } from '../../../signer'
import * as Coin from '../../../coinSelection/coin'
import * as CoinSelection from '../../../coinSelection'

// const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const bitcoin = ({ api } = {}) => {
  const refreshSelection = function * ({ feePerByte, changeAddress, receiveAddress, satoshis, algorithm, seed }) {
    const coins = yield select(S.getCoins)
    const targetCoin = Coin.fromJS({ address: receiveAddress, value: satoshis })
    yield put(A.setBitcoinSelection(feePerByte, targetCoin, coins, changeAddress, algorithm, seed))
  }

  const refreshEffectiveBalance = function * ({ feePerByte }) {
    const coins = yield select(S.getCoins)
    const effectiveBalance = CoinSelection.effectiveBalance(feePerByte, coins).value
    yield put(A.setBitcoinEffectiveBalance(effectiveBalance))
  }

  // const signAndPublish = function * ({ network, selection, password }) {
  //   const wrapper = yield select(wS.getWrapper)
  //   const signAndPublish = (sel, pass) => taskToPromise(sign(network, pass, wrapper, sel).chain(futurizeP(Task)(api.pushTx)))
  //   return yield call(signAndPublish, selection, password)
  // }

  // const fetchTransactionFiatAtTime = function * ({ hash, amount, time }) {
  //   const currency = yield select(compose(getCurrency, prop(settingsPath)))
  //   const data = yield call(api.getBitcoinFiatAtTime, amount, currency, time)
  //   yield put(A.setBitcoinFiatAtTime('bitcoin', currency, hash, data))
  // }

  return {
    // fetchTransactionFiatAtTime,
    refreshSelection,
    refreshEffectiveBalance
    // signAndPublish
  }
}
