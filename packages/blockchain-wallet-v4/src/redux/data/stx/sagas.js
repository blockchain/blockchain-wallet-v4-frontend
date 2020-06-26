import * as A from './actions'
import { callTask } from '../../../utils/functional'
import { deriveAddress } from '../../../utils/stx'
import { getMnemonic } from '../../wallet/selectors'
import { put, select } from 'redux-saga/effects'

export default () => {
  const generateAddress = function * (action) {
    const { payload } = action
    const { password } = payload
    const mnemonicT = yield select(getMnemonic, password)
    const mnemonic = yield callTask(mnemonicT)
    const address = deriveAddress(mnemonic)
    yield put(A.setAddress(address))
  }

  return {
    generateAddress
  }
}
