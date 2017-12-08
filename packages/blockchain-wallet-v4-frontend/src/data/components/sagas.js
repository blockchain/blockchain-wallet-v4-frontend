import { all, call } from 'redux-saga/effects'

import activity from './activity/sagas'
import advert from './advert/sagas'
import chart from './chart/sagas'
import exchange from './exchange/sagas'
import sendBitcoin from './sendBitcoin/sagas'
import sendEther from './sendEther/sagas'
import transactionBitcoin from './transactionBitcoin/sagas'
import transactionEther from './transactionEther/sagas'
import transferEther from './transferEther/sagas'

export default function * () {
  yield all([
    call(activity),
    call(advert),
    call(chart),
    call(exchange),
    call(sendBitcoin),
    call(sendEther),
    call(transactionBitcoin),
    call(transactionEther),
    call(transferEther)
  ])
}
