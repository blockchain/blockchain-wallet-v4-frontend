import { fork } from 'redux-saga/effects'
import activityList from './activityList/sagas'
import bchTransactions from './bchTransactions/sagas'
import btcTransactions from './btcTransactions/sagas'
import ethTransactions from './ethTransactions/sagas'
import exchange from './exchange/sagas'
import exchangeHistory from './exchangeHistory/sagas'
import importBtcAddress from './importBtcAddress/sagas'
import priceChart from './priceChart/sagas'
import priceTicker from './priceTicker/sagas'
import sendBch from './sendBch/sagas'
import sendBtc from './sendBtc/sagas'
import sendEth from './sendEth/sagas'
import signMessage from './signMessage/sagas'
import usedAddresses from './usedAddresses/sagas'

export default ({ api, coreSagas }) => function * () {
  yield fork(activityList({ api, coreSagas }))
  yield fork(bchTransactions({ api, coreSagas }))
  yield fork(btcTransactions({ api, coreSagas }))
  yield fork(ethTransactions({ api, coreSagas }))
  yield fork(exchange({ api, coreSagas }))
  yield fork(exchangeHistory({ api, coreSagas }))
  yield fork(importBtcAddress({ api, coreSagas }))
  yield fork(priceChart({ coreSagas }))
  yield fork(priceTicker({ coreSagas }))
  yield fork(sendBch({ api, coreSagas }))
  yield fork(sendBtc({ api, coreSagas }))
  yield fork(sendEth({ api, coreSagas }))
  yield fork(signMessage({ coreSagas }))
  yield fork(usedAddresses({ coreSagas }))
}
