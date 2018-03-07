import { all, call } from 'redux-saga/effects'

import addressesBch from './addressesBch/sagas'
import sendBitcoin from './sendBitcoin/sagas'
import sendEther from './sendEther/sagas'
import sendBch from './sendBch/sagas'
import settings from './settings/sagas'
import securityCenter from './securityCenter/sagas'
import transferEther from './transferEther/sagas'

export default function * () {
  yield all([
    call(addressesBch),
    call(sendBitcoin),
    call(sendEther),
    call(sendBch),
    call(settings),
    call(securityCenter),
    call(transferEther)
  ])
}
