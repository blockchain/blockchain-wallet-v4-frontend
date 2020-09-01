import { fork } from 'redux-saga/effects'
import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import buySell from './buySell/sagaRegister'
import contacts from './contacts/sagaRegister'
import eth from './eth/sagaRegister'
import lockbox from './lockbox/sagaRegister'
import userCredentials from './userCredentials/sagaRegister'
import whatsNew from './whatsNew/sagaRegister'
import xlm from './xlm/sagaRegister'

export default ({ api, networks }) =>
  function * coreKvStoreSaga () {
    yield fork(whatsNew({ api, networks }))
    yield fork(eth({ api, networks }))
    yield fork(bch({ api, networks }))
    yield fork(btc({ api, networks }))
    yield fork(xlm({ api, networks }))
    yield fork(buySell({ api, networks }))
    yield fork(contacts({ api, networks }))
    yield fork(lockbox({ api, networks }))
    yield fork(userCredentials({ api, networks }))
  }
