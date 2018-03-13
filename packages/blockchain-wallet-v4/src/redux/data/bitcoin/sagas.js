import { call, select } from 'redux-saga/effects'
import { futurizeP } from 'futurize'
import Task from 'data.task'

import * as wS from '../../wallet/selectors'
import { sign } from '../../../signer'
import {txHexToHashHex} from "../../../utils/bitcoin";

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const bitcoin = ({ api } = {}) => {
  const signAndPublish = function * ({ network, selection, password }) {
    const wrapper = yield select(wS.getWrapper)
    const signAndPublish = (sel, pass) => taskToPromise(sign(network, pass, wrapper, sel)
      .chain(futurizeP(Task)(txHex =>
        api.pushBitcoinTx.map(unused => txHexToHashHex(txHex)))))

    return yield call(signAndPublish, selection, password)
  }

  return {
    signAndPublish
  }
}
