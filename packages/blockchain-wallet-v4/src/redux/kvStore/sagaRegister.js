import { fork } from 'redux-saga/effects'

import whatsNew from './whatsNew/sagaRegister'
import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import eth from './eth/sagaRegister'
import xlm from './xlm/sagaRegister'
import shapeShift from './shapeShift/sagaRegister'
import buySell from './buySell/sagaRegister'
import contacts from './contacts/sagaRegister'
import lockbox from './lockbox/sagaRegister'
import userCredentials from './userCredentials/sagaRegister'

export default ({ api, networks }) =>
  function * coreKvStoreSaga () {
    yield fork(whatsNew({ api, networks }))
    yield fork(eth({ api, networks }))
    yield fork(bch({ api, networks }))
    yield fork(btc({ api, networks }))
    yield fork(xlm({ api, networks }))
    yield fork(shapeShift({ api, networks }))
    yield fork(buySell({ api, networks }))
    yield fork(contacts({ api, networks }))
    yield fork(lockbox({ api, networks }))
    yield fork(userCredentials({ api, networks }))
  }
