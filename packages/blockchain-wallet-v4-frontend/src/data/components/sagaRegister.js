import { fork } from 'redux-saga/effects'
import activityList from './activityList/sagaRegister'
import bchTransactions from './bchTransactions/sagaRegister'
import btcTransactions from './btcTransactions/sagaRegister'
import exchange from './exchange/sagaRegister'
import exchangeHistory from './exchangeHistory/sagaRegister'
import importBtcAddress from './importBtcAddress/sagaRegister'
import priceChart from './priceChart/sagaRegister'
import priceTicker from './priceTicker/sagaRegister'
import sendBch from './sendBch/sagaRegister'
import sendBtc from './sendBtc/sagaRegister'
import sendEth from './sendEth/sagaRegister'
import signMessage from './signMessage/sagaRegister'
import usedAddresses from './usedAddresses/sagaRegister'

export default ({ api, coreSagas }) => function * () {
  yield fork(activityList({ api, coreSagas }))
  yield fork(bchTransactions({ api, coreSagas }))
  yield fork(btcTransactions({ api, coreSagas }))
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
