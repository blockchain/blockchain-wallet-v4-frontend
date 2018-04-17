import { all, fork } from 'redux-saga/effects'

import addressesBch from './addressesBch/sagas'
import coinify from './coinify/sagas'
import sendEther from './sendEther/sagas'
import sendBch from './sendBch/sagas'
import sendShapeshift from './sendShapeshift/sagas'
import settings from './settings/sagas'
import securityCenter from './securityCenter/sagas'
import transferEther from './transferEther/sagas'
import sfox from './sfox/sagas'

export default ({ coreSagas }) => function * () {
  yield all([
    fork(addressesBch({ coreSagas })),
    fork(coinify({ coreSagas })),
    fork(sendEther({ coreSagas })),
    fork(sendBch({ coreSagas })),
    fork(sendShapeshift({ coreSagas })),
    fork(settings({ coreSagas })),
    fork(securityCenter({ coreSagas })),
    fork(transferEther({ coreSagas })),
    fork(sfox({ coreSagas }))
  ])
}
