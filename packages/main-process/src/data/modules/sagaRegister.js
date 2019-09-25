import { fork } from 'redux-saga/effects'
import addressesBch from './addressesBch/sagaRegister'
import profile from './profile/sagaRegister'
import rates from './rates/sagaRegister'
import settings from './settings/sagaRegister'
import securityCenter from './securityCenter/sagaRegister'
import transferEth from './transferEth/sagaRegister'
import sfox from './sfox/sagaRegister'

export default (...args) =>
  function * modulesSaga () {
    yield fork(addressesBch(...args))
    yield fork(profile(...args))
    yield fork(rates(...args))
    yield fork(settings(...args))
    yield fork(securityCenter(...args))
    yield fork(transferEth(...args))
    yield fork(sfox(...args))
  }
