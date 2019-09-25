import { fork } from 'redux-saga/effects'
import profile from './profile/sagaRegister'
import settings from './settings/sagaRegister'
import securityCenter from './securityCenter/sagaRegister'

export default (...args) =>
  function * modulesSaga () {
    yield fork(profile(...args))
    yield fork(settings(...args))
    yield fork(securityCenter(...args))
  }
