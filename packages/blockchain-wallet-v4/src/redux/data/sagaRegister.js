import { fork } from 'redux-saga/effects'

import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import coinify from './coinify/sagaRegister'
import eth from './eth/sagaRegister'
import misc from './misc/sagaRegister'
import sfox from './sfox/sagaRegister'
import xlm from './xlm/sagaRegister'

export default ({ api, options, networks }) =>
  function * coreDataSaga () {
    yield fork(bch({ api }))
    yield fork(btc({ api }))
    yield fork(coinify({ api, options }))
    yield fork(eth({ api }))
    yield fork(misc({ api }))
    yield fork(sfox({ api, options }))
    yield fork(xlm({ api, networks }))
  }
