import { all, call } from 'redux-saga/effects'

import coinConvertor from './coinConvertor/sagas'
import exchange from './exchange/sagas'
import exchangeHistory from './exchangeHistory/sagas'
import sendBitcoin from './sendBitcoin/sagas'
import sendEther from './sendEther/sagas'
import settings from './settings/sagas'
import transactionBitcoin from './transactionBitcoin/sagas'
import transferEther from './transferEther/sagas'

export default function * () {
  yield all([
    call(coinConvertor),
    call(exchange),
    call(exchangeHistory),
    call(sendBitcoin),
    call(sendEther),
    call(settings),
    call(transactionBitcoin),
    call(transferEther)
  ])
}
