import { call, select } from 'redux-saga/effects'

import * as wS from '../../wallet/selectors'
import * as signer from '../../../signer'
import { futurizeP } from 'futurize'
import Task from 'data.task'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api } = {}) => {
  const pushBchTx = futurizeP(Task)(api.pushBchTx)
  const signAndPublish = function * ({ network, selection, password }) {
    const wrapper = yield select(wS.getWrapper)
    let signAndPublish = signer.bch.sign(network, password, wrapper, selection).chain(pushBchTx)
    return yield call(() => taskToPromise(signAndPublish))
  }

  return {
    signAndPublish
  }
}
