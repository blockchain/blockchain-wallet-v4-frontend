import { fork } from 'redux-saga/effects'

import whatsNew from './whatsNew/sagaRegister'
import ethereum from './ethereum/sagaRegister'
import bch from './bch/sagaRegister'
import shapeShift from './shapeShift/sagaRegister'
import buySell from './buySell/sagaRegister'
import contacts from './contacts/sagaRegister'

export default ({ api }) => function * () {
  fork(whatsNew({ api })),
  fork(ethereum({ api })),
  fork(bch({ api })),
  fork(shapeShift({ api })),
  fork(buySell({ api })),
  fork(contacts({ api }))
}
