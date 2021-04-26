import { fork } from 'redux-saga/effects'

import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import eth from './eth/sagaRegister'
import lockbox from './lockbox/sagaRegister'
import userCredentials from './userCredentials/sagaRegister'
import walletCredentials from './walletCredentials/sagaRegister'
import xlm from './xlm/sagaRegister'

export default ({ api, networks }) =>
  function* coreKvStoreSaga() {
    yield fork(bch({ api, networks }))
    yield fork(btc({ api, networks }))
    yield fork(eth({ api, networks }))
    yield fork(lockbox({ api, networks }))
    yield fork(userCredentials({ api, networks }))
    yield fork(walletCredentials({ api, networks }))
    yield fork(xlm({ api, networks }))
  }
