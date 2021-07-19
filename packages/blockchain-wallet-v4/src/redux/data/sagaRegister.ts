import { fork } from 'redux-saga/effects'

import algo from './algo/sagaRegister'
import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import clout from './clout/sagaRegister'
import doge from './doge/sagaRegister'
import dot from './dot/sagaRegister'
import eth from './eth/sagaRegister'
import fiat from './fiat/sagaRegister'
import misc from './misc/sagaRegister'
import stx from './stx/sagaRegister'
import xlm from './xlm/sagaRegister'

export default ({ api, networks }) =>
  function* coreDataSaga() {
    yield fork(algo({ api }))
    yield fork(bch({ api }))
    yield fork(btc({ api }))
    yield fork(clout({ api }))
    yield fork(doge({ api }))
    yield fork(dot({ api }))
    yield fork(eth({ api }))
    yield fork(fiat({ api }))
    yield fork(misc({ api }))
    yield fork(stx())
    yield fork(xlm({ api, networks }))
  }
