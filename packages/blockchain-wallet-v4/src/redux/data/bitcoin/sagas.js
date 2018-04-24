import { call, select } from 'redux-saga/effects'
// import { map, set, merge } from 'ramda'
import { futurizeP } from 'futurize'
import Task from 'data.task'

import * as S from '../../selectors'
import * as signer from '../../../signer'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const pushBitcoinTx = futurizeP(Task)(api.pushBitcoinTx)

  const signAndPublish = function * ({ network, selection, password }) {
    let wrapper = yield select(S.wallet.getWrapper)
    let signAndPublish = signer.btc.sign(network, password, wrapper, selection).chain(pushBitcoinTx)
    return yield call(() => taskToPromise(signAndPublish))
  }

  return {
    signAndPublish
  }
}
