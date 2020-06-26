import { fork } from 'redux-saga/effects'
import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import eth from './eth/sagaRegister'
import misc from './misc/sagaRegister'
import stx from './stx/sagaRegister'
import xlm from './xlm/sagaRegister'

export default ({ api, options, networks }) =>
  function * coreDataSaga () {
    yield fork(bch({ api }))
    yield fork(btc({ api }))
    yield fork(eth({ api }))
    yield fork(misc({ api }))
    yield fork(stx())
    yield fork(xlm({ api, networks }))
  }
