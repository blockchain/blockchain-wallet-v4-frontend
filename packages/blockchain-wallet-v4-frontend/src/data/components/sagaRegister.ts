import { fork } from 'redux-saga/effects'

import algoTransactions from './algoTransactions/sagaRegister'
import bchTransactions from './bchTransactions/sagaRegister'
import borrow from './borrow/sagaRegister'
import brokerage from './brokerage/sagaRegister'
import btcTransactions from './btcTransactions/sagaRegister'
import dotTransactions from './dotTransactions/sagaRegister'
import ethTransactions from './ethTransactions/sagaRegister'
import fiatTransactions from './fiatTransactions/sagaRegister'
import identityVerification from './identityVerification/sagaRegister'
import importBtcAddress from './importBtcAddress/sagaRegister'
import interest from './interest/sagaRegister'
import lockbox from './lockbox/sagaRegister'
import manageAddresses from './manageAddresses/sagaRegister'
import onboarding from './onboarding/sagaRegister'
import priceChart from './priceChart/sagaRegister'
import priceTicker from './priceTicker/sagaRegister'
import refresh from './refresh/sagaRegister'
import send from './send/sagaRegister'
import sendBch from './sendBch/sagaRegister'
import sendBtc from './sendBtc/sagaRegister'
import sendEth from './sendEth/sagaRegister'
import sendXlm from './sendXlm/sagaRegister'
import settings from './settings/sagaRegister'
import signMessage from './signMessage/sagaRegister'
import simpleBuy from './simpleBuy/sagaRegister'
import swap from './swap/sagaRegister'
import uploadDocuments from './uploadDocuments/sagaRegister'
import veriff from './veriff/sagaRegister'
import withdraw from './withdraw/sagaRegister'
import xlmTransactions from './xlmTransactions/sagaRegister'

export default ({ api, coreSagas, networks }) =>
  function * componentsSaga() {
    yield fork(algoTransactions())
    yield fork(borrow({ api, coreSagas, networks }))
    yield fork(brokerage({ api, coreSagas, networks }))
    yield fork(bchTransactions())
    yield fork(btcTransactions())
    yield fork(dotTransactions())
    yield fork(ethTransactions())
    yield fork(xlmTransactions())
    yield fork(fiatTransactions())
    yield fork(identityVerification({ api, coreSagas }))
    yield fork(interest({ api, coreSagas, networks }))
    yield fork(lockbox({ api, coreSagas }))
    yield fork(importBtcAddress({ api, coreSagas, networks }))
    yield fork(manageAddresses({ api, networks }))
    yield fork(onboarding())
    yield fork(priceChart())
    yield fork(priceTicker({ coreSagas }))
    yield fork(refresh())
    yield fork(send({ api, coreSagas, networks }))
    yield fork(sendBch({ api, coreSagas, networks }))
    yield fork(sendBtc({ api, coreSagas, networks }))
    yield fork(sendEth({ api, coreSagas, networks }))
    yield fork(sendXlm({ api, coreSagas, networks }))
    yield fork(settings({ api, coreSagas }))
    yield fork(signMessage({ coreSagas }))
    yield fork(simpleBuy({ api, coreSagas, networks }))
    yield fork(swap({ api, coreSagas, networks }))
    yield fork(uploadDocuments({ api }))
    yield fork(withdraw({ api }))
    yield fork(veriff({ api, coreSagas }))
  }
