import { fork } from 'redux-saga/effects'
import addressesBch from './addressesBch/sagaRegister'
import coinify from './coinify/sagaRegister'
import settings from './settings/sagaRegister'
import securityCenter from './securityCenter/sagaRegister'
import transferEth from './transferEth/sagaRegister'
import sfox from './sfox/sagaRegister'

export default ({ coreSagas, networks }) =>
  function*() {
    yield fork(addressesBch({ coreSagas }))
    yield fork(coinify({ coreSagas, networks }))
    yield fork(settings({ coreSagas }))
    yield fork(securityCenter({ coreSagas }))
    yield fork(transferEth({ coreSagas }))
    yield fork(sfox({ coreSagas, networks }))
  }
