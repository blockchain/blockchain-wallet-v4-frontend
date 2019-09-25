import { fork } from 'redux-saga/effects'
import activityList from './activityList/sagaRegister'
import bchTransactions from './bchTransactions/sagaRegister'
import btcTransactions from './btcTransactions/sagaRegister'
import coinify from './coinify/sagaRegister'
import ethTransactions from './ethTransactions/sagaRegister'
import xlmTransactions from './xlmTransactions/sagaRegister'
import exchange from './exchange/sagaRegister'
import exchangeHistory from './exchangeHistory/sagaRegister'
import identityVerification from './identityVerification/sagaRegister'
import importBtcAddress from './importBtcAddress/sagaRegister'
import lockbox from './lockbox/sagaRegister'
import manageAddresses from './manageAddresses/sagaRegister'
import onboarding from './onboarding/sagaRegister'
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
import sendEth from './sendEth/sagaRegister'
import sendXlm from './sendXlm/sagaRegister'
import settings from './settings/sagaRegister'
import signMessage from './signMessage/sagaRegister'
import transactionReport from './transactionReport/sagaRegister'
import uploadDocuments from './uploadDocuments/sagaRegister'
import veriff from './veriff/sagaRegister'

export default (...args) =>
  function * componentsSaga () {
    yield fork(activityList())
    yield fork(bchTransactions())
    yield fork(btcTransactions())
    yield fork(coinify(...args))
    yield fork(ethTransactions())
    yield fork(xlmTransactions())
    yield fork(exchange(...args))
    yield fork(exchangeHistory(...args))
    yield fork(identityVerification(...args))
    yield fork(lockbox(...args))
    yield fork(importBtcAddress(...args))
    yield fork(manageAddresses(...args))
    yield fork(onboarding())
    yield fork(onfido(...args))
    yield fork(priceChart(...args))
    yield fork(priceTicker(...args))
    yield fork(refresh())
    yield fork(requestBtc(...args))
    yield fork(requestBch(...args))
    yield fork(requestEth(...args))
    yield fork(requestXlm())
    yield fork(sendBch(...args))
    yield fork(sendBtc(...args))
    yield fork(sendEth(...args))
    yield fork(sendXlm(...args))
    yield fork(settings(...args))
    yield fork(signMessage(...args))
    yield fork(transactionReport(...args))
    yield fork(uploadDocuments(...args))
    yield fork(veriff(...args))
  }
