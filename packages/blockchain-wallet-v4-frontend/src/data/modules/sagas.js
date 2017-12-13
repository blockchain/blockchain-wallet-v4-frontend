import { all, call } from 'redux-saga/effects'

import activity from './activity/sagas'
import advert from './advert/sagas'
import balanceSummary from './balanceSummary/sagas'
import chart from './chart/sagas'
import coinConvertor from './coinConvertor/sagas'
import exchange from './exchange/sagas'
import exchangeHistory from './exchangeHistory/sagas'
import fiatDisplay from './fiatDisplay/sagas'
import menuTopBalance from './menuTopBalance/sagas'
import securityGauge from './securityGauge/sagas'
import sendBitcoin from './sendBitcoin/sagas'
import sendEther from './sendEther/sagas'
import settings from './settings/sagas'
import tickerBitcoin from './tickerBitcoin/sagas'
import tickerEther from './tickerEther/sagas'
import transactionBitcoin from './transactionBitcoin/sagas'
import transactionEther from './transactionEther/sagas'
import transferEther from './transferEther/sagas'
import whatsNew from './whatsNew/sagas'

export default function * () {
  yield all([
    call(activity),
    call(advert),
    call(balanceSummary),
    call(chart),
    call(coinConvertor),
    call(exchange),
    call(exchangeHistory),
    call(fiatDisplay),
    call(menuTopBalance),
    call(securityGauge),
    call(sendBitcoin),
    call(sendEther),
    call(settings),
    call(tickerBitcoin),
    call(tickerEther),
    call(transactionBitcoin),
    call(transactionEther),
    call(transferEther),
    call(whatsNew)
  ])
}
