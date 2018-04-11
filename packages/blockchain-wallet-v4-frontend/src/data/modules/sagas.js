import { all, fork } from 'redux-saga/effects'

import addressesBch from './addressesBch/sagas'
import coinify from './coinify/sagas'
import sendBitcoin from './sendBitcoin/sagas'
import sendEther from './sendEther/sagas'
import sendBch from './sendBch/sagas'
import sendShapeshift from './sendShapeshift/sagas'
import settings from './settings/sagas'
import securityCenter from './securityCenter/sagas'
import transferEther from './transferEther/sagas'
import sfox from './sfox/sagas'

export default ({ coreSagas }) => function * () {
  yield all([
<<<<<<< HEAD
    call(addressesBch),
    call(coinify),
    call(sendBitcoin),
    call(sendEther),
    call(sendBch),
    call(sendShapeshift),
    call(settings),
    call(securityCenter),
    call(transferEther),
    call(sfox)
=======
    fork(addressesBch({ coreSagas })),
    fork(coinify({ coreSagas })),
    fork(sendBitcoin({ coreSagas })),
    fork(sendEther({ coreSagas })),
    fork(sendBch({ coreSagas })),
    fork(settings({ coreSagas })),
    fork(securityCenter({ coreSagas })),
    fork(transferEther({ coreSagas })),
    fork(sfox({ coreSagas }))
>>>>>>> master
  ])
}
