import { fork } from 'redux-saga/effects'
import activityList from './activityList/sagaRegister'
import bchTransactions from './bchTransactions/sagaRegister'
import btcTransactions from './btcTransactions/sagaRegister'
import ethTransactions from './ethTransactions/sagaRegister'
import exchange from './exchange/sagaRegister'
import exchangeHistory from './exchangeHistory/sagaRegister'
import importBtcAddress from './importBtcAddress/sagaRegister'
import manageAddresses from './manageAddresses/sagaRegister'
import priceChart from './priceChart/sagaRegister'
import priceTicker from './priceTicker/sagaRegister'
import refresh from './refresh/sagaRegister'
import requestBtc from './requestBtc/sagaRegister'
import requestEth from './requestEth/sagaRegister'
import sendBch from './sendBch/sagaRegister'
import sendBtc from './sendBtc/sagaRegister'
import sendEth from './sendEth/sagaRegister'
import settings from './settings/sagaRegister'
import signMessage from './signMessage/sagaRegister'
import transactionReport from './transactionReport/sagaRegister'

export default ({ api, coreSagas }) => function * () {
  yield fork(activityList({ api, coreSagas }))
  yield fork(bchTransactions({ api, coreSagas }))
  yield fork(btcTransactions({ api, coreSagas }))
  yield fork(ethTransactions({ api, coreSagas }))
  yield fork(exchange({ api, coreSagas }))
  yield fork(exchangeHistory({ api, coreSagas }))
  yield fork(importBtcAddress({ api, coreSagas }))
  yield fork(manageAddresses({ api, coreSagas }))
  yield fork(priceChart({ coreSagas }))
  yield fork(priceTicker({ coreSagas }))
  yield fork(refresh())
  yield fork(requestBtc())
  yield fork(requestEth())
  yield fork(sendBch({ api, coreSagas }))
  yield fork(sendBtc({ api, coreSagas }))
  yield fork(sendEth({ api, coreSagas }))
  yield fork(settings({ api, coreSagas }))
  yield fork(signMessage({ coreSagas }))
  yield fork(transactionReport({ api, coreSagas }))
}
