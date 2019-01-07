import { fork } from 'redux-saga/effects'
import addressesBch from './addressesBch/sagaRegister'
import coinify from './coinify/sagaRegister'
import profile from './profile/sagaRegister'
import rates from './rates/sagaRegister'
import settings from './settings/sagaRegister'
import securityCenter from './securityCenter/sagaRegister'
import transferEth from './transferEth/sagaRegister'
import sfox from './sfox/sagaRegister'

export default ({ api, coreSagas, networks }) =>
  function* modulesSaga () {
    yield fork(addressesBch({ coreSagas, networks }))
    yield fork(coinify({ coreSagas, networks }))
    yield fork(profile({ api, coreSagas }))
    yield fork(rates({ api }))
    yield fork(settings({ api, coreSagas }))
    yield fork(securityCenter({ coreSagas }))
    yield fork(transferEth({ coreSagas, networks }))
    yield fork(sfox({ api, coreSagas, networks }))
  }
