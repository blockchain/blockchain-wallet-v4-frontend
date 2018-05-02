import { fork } from 'redux-saga/effects'

import whatsNew from './whatsNew/sagaRegister'
import ethereum from './ethereum/sagaRegister'
import bch from './bch/sagaRegister'
import shapeShift from './shapeShift/sagaRegister'
import buySell from './buySell/sagaRegister'
import contacts from './contacts/sagaRegister'

export default ({ api }) => function * () {
  yield fork(whatsNew({ api }))
  yield fork(ethereum({ api }))
  yield fork(bch({ api }))
  yield fork(shapeShift({ api }))
  yield fork(buySell({ api }))
  yield fork(contacts({ api }))
}
