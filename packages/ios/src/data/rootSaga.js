// -- EXPOSE THE ROOT SAGA -- //
import { all, call, fork } from 'redux-saga/effects'
import login from './auth/sagas'

const welcomeSaga = function * () {
  if (console) {
    const version = '4.0.0.0'
    const style = 'background: #16B5E7; color: #FFF; font-size: 14px;'
    console.log(`%c Blockchain iOS Wallet ${version} `, style)
  }
}

export default function * () {
  yield all([
    call(welcomeSaga),
    fork(login)
  ])
}
