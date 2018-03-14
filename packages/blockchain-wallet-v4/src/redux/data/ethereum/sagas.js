import { call, select } from 'redux-saga/effects'
import * as wS from '../../wallet/selectors'
import { signETH } from '../../../signer'
import {txHexToHashHex} from "../../../utils/ethereum";

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const ethereum = ({ api } = {}) => {
  const signAndPublish = function * ({ network, data, password }) {
    const getMnemonic = state => wS.getMnemonic(state, password)
    const eitherMnemonic = yield select(getMnemonic)
    if (eitherMnemonic.isRight) {
      const mnemonic = eitherMnemonic.value
      const signAndPublish = (data, pass) =>
        taskToPromise(signETH(network, mnemonic, data)
          .then(txHex => api.pushEthereumTx
            .then(() => txHexToHashHex(txHex))))

      return yield call(signAndPublish, data, password)
    } else {
      throw new Error('Could not read mnemonic')
    }
  }

  return {
    signAndPublish
  }
}
