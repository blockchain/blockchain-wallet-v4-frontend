import { call, select } from 'redux-saga/effects'
import * as wS from '../../wallet/selectors'
import { eth } from '../../../signer'
import Task from 'data.task'
import { futurizeP } from 'futurize'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const signAndPublish = function * ({ network, data, password }) {
    const getMnemonic = state => wS.getMnemonic(state, password)
    const eitherMnemonic = yield select(getMnemonic)
    if (eitherMnemonic.isRight) {
      const mnemonic = eitherMnemonic.value
      const signAndPublish = (data, pass) => taskToPromise(eth.sign(network, mnemonic, data).chain(futurizeP(Task)(api.pushEthereumTx)))
      return yield call(signAndPublish, data, password)
    } else {
      throw new Error('Could not read mnemonic')
    }
  }

  return {
    signAndPublish
  }
}
