import { fork } from 'redux-saga/effects'

import whatsNew from './whatsNew/sagaRegister'
import ethereum from './eth/sagaRegister'
import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import shapeShift from './shapeShift/sagaRegister'
import buySell from './buySell/sagaRegister'
import contacts from './contacts/sagaRegister'
import lockbox from './lockbox/sagaRegister'

export default ({ api, networks }) =>
  function*() {
    yield fork(whatsNew({ api, networks }))
    yield fork(ethereum({ api, networks }))
    yield fork(bch({ api, networks }))
    yield fork(btc({ api, networks }))
    yield fork(shapeShift({ api, networks }))
    yield fork(buySell({ api, networks }))
    yield fork(contacts({ api, networks }))
    yield fork(lockbox({ api, networks }))
  }
