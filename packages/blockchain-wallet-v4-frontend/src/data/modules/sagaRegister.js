import { fork } from 'redux-saga/effects'

import addressesBch from './addressesBch/sagaRegister'
import profile from './profile/sagaRegister'
import rates from './rates/sagaRegister'
import securityCenter from './securityCenter/sagaRegister'
import settings from './settings/sagaRegister'
import transferEth from './transferEth/sagaRegister'

export default ({ api, coreSagas, networks }) =>
  function * modulesSaga() {
    yield fork(addressesBch({ coreSagas, networks }))
    yield fork(profile({ api, coreSagas, networks }))
    yield fork(rates({ api }))
    yield fork(settings({ api, coreSagas }))
    yield fork(securityCenter({ coreSagas }))
    yield fork(transferEth({ coreSagas, networks }))
  }
