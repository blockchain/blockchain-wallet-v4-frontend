import { all, fork } from 'redux-saga/effects'
import data from './data/sagaRegister'
import kvStore from './kvStore/sagaRegister'
import walletOptions from './walletOptions/sagaRegister'
import settings from './settings/sagaRegister'
import wallet from './wallet/sagaRegister'

export default (...args) =>
  function * coreSaga () {
    yield all([
      fork(data(...args)),
      fork(kvStore(...args)),
      fork(walletOptions(...args)),
      fork(settings(...args)),
      fork(wallet(...args))
    ])
  }
