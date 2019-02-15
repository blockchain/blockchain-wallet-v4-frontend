import { fork } from 'redux-saga/effects'
import activityList from './activityList/sagaRegister'
import bchTransactions from './bchTransactions/sagaRegister'
import btcTransactions from './btcTransactions/sagaRegister'
import bsvTransactions from './bsvTransactions/sagaRegister'
import ethTransactions from './ethTransactions/sagaRegister'
import xlmTransactions from './xlmTransactions/sagaRegister'
import exchange from './exchange/sagaRegister'
import exchangeHistory from './exchangeHistory/sagaRegister'
import identityVerification from './identityVerification/sagaRegister'
import importBtcAddress from './importBtcAddress/sagaRegister'
import lockbox from './lockbox/sagaRegister'
import login from './login/sagaRegister'
import manageAddresses from './manageAddresses/sagaRegister'
import onfido from './onfido/sagaRegister'
import priceChart from './priceChart/sagaRegister'
import priceTicker from './priceTicker/sagaRegister'
import refresh from './refresh/sagaRegister'
import requestBtc from './requestBtc/sagaRegister'
import requestBch from './requestBch/sagaRegister'
import requestEth from './requestEth/sagaRegister'
import requestXlm from './requestXlm/sagaRegister'
import sendBch from './sendBch/sagaRegister'
import sendBtc from './sendBtc/sagaRegister'
import sendBsv from './sendBsv/sagaRegister'
import sendEth from './sendEth/sagaRegister'
import sendXlm from './sendXlm/sagaRegister'
import settings from './settings/sagaRegister'
import signMessage from './signMessage/sagaRegister'
import swapGetStarted from './swapGetStarted/sagaRegister'
import transactionReport from './transactionReport/sagaRegister'
import uploadDocuments from './uploadDocuments/sagaRegister'
import veriff from './veriff/sagaRegister'

export default ({ api, coreSagas, networks, options }) =>
  function* componentsSaga () {
    yield fork(activityList())
    yield fork(bchTransactions())
    yield fork(btcTransactions())
    yield fork(bsvTransactions())
    yield fork(ethTransactions())
    yield fork(xlmTransactions())
    yield fork(exchange({ api, coreSagas, networks }))
    yield fork(exchangeHistory({ api, coreSagas }))
    yield fork(identityVerification({ api, coreSagas }))
    yield fork(lockbox({ api, coreSagas }))
    yield fork(importBtcAddress({ api, coreSagas, networks }))
    yield fork(login())
    yield fork(manageAddresses({ api, networks }))
    yield fork(onfido({ api, coreSagas }))
    yield fork(priceChart({ coreSagas }))
    yield fork(priceTicker({ coreSagas }))
    yield fork(refresh())
    yield fork(requestBtc({ networks }))
    yield fork(requestBch({ networks }))
    yield fork(requestEth({ networks }))
    yield fork(requestXlm())
    yield fork(sendBch({ coreSagas, networks }))
    yield fork(sendBtc({ coreSagas, networks }))
    yield fork(sendBsv({ coreSagas, networks }))
    yield fork(sendEth({ coreSagas, networks }))
    yield fork(sendXlm({ coreSagas }))
    yield fork(settings({ coreSagas }))
    yield fork(signMessage({ coreSagas }))
    yield fork(swapGetStarted())
    yield fork(transactionReport({ coreSagas }))
    yield fork(uploadDocuments({ api }))
    yield fork(veriff({ api, coreSagas }))
  }
