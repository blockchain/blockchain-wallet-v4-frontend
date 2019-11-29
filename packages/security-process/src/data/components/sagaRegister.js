import { fork } from 'redux-saga/effects'
import priceChart from './priceChart/sagaRegister'

export default ({ api, coreSagas, networks }) =>
  function * componentsSaga () {
    yield fork(priceChart({ coreSagas }))
  }
