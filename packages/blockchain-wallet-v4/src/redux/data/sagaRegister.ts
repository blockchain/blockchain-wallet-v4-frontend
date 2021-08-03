import { fork } from 'redux-saga/effects'

import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import coins from './coins/sagaRegister'
import eth from './eth/sagaRegister'
import fiat from './fiat/sagaRegister'
import misc from './misc/sagaRegister'
import xlm from './xlm/sagaRegister'

export default ({ api, networks }) =>
  function* coreDataSaga() {
    yield fork(bch({ api }))
    yield fork(btc({ api }))
    yield fork(coins({ api }))
    yield fork(eth({ api }))
    yield fork(fiat({ api }))
    yield fork(misc({ api }))
    yield fork(xlm({ api, networks }))
  }
