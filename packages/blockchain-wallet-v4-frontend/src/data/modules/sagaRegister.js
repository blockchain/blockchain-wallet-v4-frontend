import { fork } from 'redux-saga/effects'
import addressesBch from './addressesBch/sagaRegister'
import coinify from './coinify/sagaRegister'
import profile from './profile/sagaRegister'
import rates from './rates/sagaRegister'
import settings from './settings/sagaRegister'
import securityCenter from './securityCenter/sagaRegister'
import transferEth from './transferEth/sagaRegister'
import sfox from './sfox/sagaRegister'

export default ({ coreSagas, api }) =>
  function*() {
    yield fork(addressesBch({ coreSagas }))
    yield fork(coinify({ coreSagas }))
    yield fork(profile({ api, coreSagas }))
    yield fork(rates({ api }))
    yield fork(settings({ coreSagas }))
    yield fork(securityCenter({ coreSagas }))
    yield fork(transferEth({ coreSagas }))
    yield fork(sfox({ coreSagas }))
  }
