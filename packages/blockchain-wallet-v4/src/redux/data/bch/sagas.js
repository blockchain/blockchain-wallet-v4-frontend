import { call, select } from 'redux-saga/effects'

import * as wS from '../../wallet/selectors'
import { sign } from '../../../signer'
import { txHexToHashHex } from '../../../utils/bitcoin'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const bch = ({ api } = {}) => {
  const signAndPublish = function * ({ network, selection, password }) {
    const wrapper = yield select(wS.getWrapper)
    const signAndPublish = (sel, pass) => taskToPromise(sign('BCH', network, pass, wrapper, sel))
      .then(txHex => api.pushBchTx(txHex)
        .then(() => txHexToHashHex(txHex)))

    return yield call(signAndPublish, selection, password)
  }

  return {
    signAndPublish
  }
}
