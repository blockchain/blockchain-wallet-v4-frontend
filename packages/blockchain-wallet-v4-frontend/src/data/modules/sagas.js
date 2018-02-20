import { all, call } from 'redux-saga/effects'

import sendBtc from './sendBtc/sagas'
import sendEther from './sendEther/sagas'
import sendBch from './sendBch/sagas'
import settings from './settings/sagas'
import transferEther from './transferEther/sagas'

export default function * () {
  yield all([
    call(sendBtc),
    call(sendEther),
    call(sendBch),
    call(settings),
    call(transferEther)
  ])
}
