
import { all, call, fork } from 'redux-saga/effects'
import time from './time/sagas'
import { api } from '../services/ApiService'
import { socket } from '../services/SocketService'
import { coreSagasFactory, rootSaga } from 'blockchain-wallet-v4/src'

const sagas = { core: coreSagasFactory({ api, socket }) }
// const coreRootSaga = rootSaga({ api, socket })

const welcomeSaga = function * () {
  console.log('Hello from rootsaga ')
}

export default function * () {
  yield all([
    call(welcomeSaga),
    fork(time)
    // fork(coreRootSaga)
  ])
}