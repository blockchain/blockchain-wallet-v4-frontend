import { call, select } from 'redux-saga/effects'
import { futurizeP } from 'futurize'
import Task from 'data.task'

import * as wS from '../../wallet/selectors'
import { sign } from '../../../signer'
import * as Coin from '../../../coinSelection/coin'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const bitcoin = ({ api } = {}) => {
  const pushBitcoinTx = futurizeP(Task)(api.pushBitcoinTx)

  const fetchUnspent = function * (addresses) {
    let result = yield call(api.getBitcoinUnspents, addresses, -1)
    return result.unspent_outputs.map(Coin.fromJS)
  }

  const signAndPublish = function * ({ network, selection, password }) {
    let wrapper = yield select(wS.getWrapper)
    let signAndPublish = sign(network, password, wrapper, selection).chain(pushBitcoinTx)
    return yield call(() => taskToPromise(signAndPublish))
  }

  return {
    fetchUnspent,
    signAndPublish
  }
}
