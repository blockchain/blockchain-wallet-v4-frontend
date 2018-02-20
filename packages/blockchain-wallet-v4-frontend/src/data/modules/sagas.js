import { all, call } from 'redux-saga/effects'

import sendBtc from './sendBtc/sagas'
import sendEth from './sendEth/sagas'
import sendBch from './sendBch/sagas'
import settings from './settings/sagas'
import transferEther from './transferEther/sagas'

export default function * () {
  yield all([
    call(sendBtc),
    call(sendEth),
    call(sendBch),
    call(settings),
    call(transferEther)
  ])
}
