import { fork } from 'redux-saga/effects'

import addressesBch from './addressesBch/sagaRegister'
import coinify from './coinify/sagaRegister'
import settings from './settings/sagaRegister'
import securityCenter from './securityCenter/sagaRegister'
import transferEther from './transferEther/sagaRegister'
import sfox from './sfox/sagaRegister'

export default ({ coreSagas }) => function * () {
  fork(addressesBch({ coreSagas })),
  fork(coinify({ coreSagas })),
  fork(settings({ coreSagas })),
  fork(securityCenter({ coreSagas })),
  fork(transferEther({ coreSagas })),
  fork(sfox({ coreSagas }))
}
