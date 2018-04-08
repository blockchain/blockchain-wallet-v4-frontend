import { call, select } from 'redux-saga/effects'
import { futurizeP } from 'futurize'
import Task from 'data.task'

import * as wS from '../../wallet/selectors'
import { sign } from '../../../signer'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const bch = ({ api } = {}) => {
  const signAndPublish = function * ({ network, selection, password }) {
    const wrapper = yield select(wS.getWrapper)
    const signAndPublish = (sel, pass) => taskToPromise(sign('BCH', network, pass, wrapper, sel).chain(futurizeP(Task)(api.pushBchTx)))
    return yield call(signAndPublish, selection, password)
  }

  return {
    signAndPublish
  }
}
