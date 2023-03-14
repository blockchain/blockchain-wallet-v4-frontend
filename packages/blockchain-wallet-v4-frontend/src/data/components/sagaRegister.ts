import { fork } from 'redux-saga/effects'

import bchTransactions from './bchTransactions/sagaRegister'
import brokerage from './brokerage/sagaRegister'
import btcTransactions from './btcTransactions/sagaRegister'
import buySell from './buySell/sagaRegister'
import coinTransactions from './coinTransactions/sagaRegister'
import debitCard from './debitCard/sagaRegister'
import dex from './dex/sagaRegister'
import ethTransactions from './ethTransactions/sagaRegister'
import fiatTransactions from './fiatTransactions/sagaRegister'
import fundRecovery from './fundRecovery/sagaRegister'
import identityVerification from './identityVerification/sagaRegister'
import importBtcAddress from './importBtcAddress/sagaRegister'
import interest from './interest/sagaRegister'
import interestUploadDocument from './interestUploadDocument/sagaRegister'
import manageAddresses from './manageAddresses/sagaRegister'
import nfts from './nfts/sagaRegister'
import onboarding from './onboarding/sagaRegister'
import priceChart from './priceChart/sagaRegister'
import recurringBuy from './recurringBuy/sagaRegister'
import referral from './referral/sagaRegister'
import refresh from './refresh/sagaRegister'
import request from './request/sagaRegister'
import resetWallet2fa from './resetWallet2fa/sagaRegister'
import send from './send/sagaRegister'
import sendBch from './sendBch/sagaRegister'
import sendBtc from './sendBtc/sagaRegister'
import sendCrypto from './sendCrypto/sagaRegister'
import sendEth from './sendEth/sagaRegister'
import sendXlm from './sendXlm/sagaRegister'
import settings from './settings/sagaRegister'
import signMessage from './signMessage/sagaRegister'
import swap from './swap/sagaRegister'
import taxCenter from './taxCenter/sagaRegister'
import termsAndConditions from './termsAndConditions/sagaRegister'
import uploadDocuments from './uploadDocuments/sagaRegister'
import veriff from './veriff/sagaRegister'
import withdraw from './withdraw/sagaRegister'
import xlmTransactions from './xlmTransactions/sagaRegister'

export default ({ api, coreSagas, networks }) =>
  function* componentsSaga() {
    yield fork(brokerage({ api, coreSagas, networks }))
    yield fork(bchTransactions())
    yield fork(btcTransactions())
    yield fork(coinTransactions())
    yield fork(debitCard({ api, coreSagas, networks }))
    yield fork(dex({ api }))
    yield fork(ethTransactions())
    yield fork(xlmTransactions())
    yield fork(fiatTransactions())
    yield fork(fundRecovery({ api }))
    yield fork(identityVerification({ api, coreSagas, networks }))
    yield fork(interest({ api, coreSagas, networks }))
    yield fork(interestUploadDocument({ api }))
    yield fork(termsAndConditions({ api }))
    yield fork(importBtcAddress({ api, coreSagas, networks }))
    yield fork(manageAddresses({ api, networks }))
    yield fork(onboarding())
    yield fork(nfts({ api, coreSagas, networks }))
    yield fork(priceChart())
    yield fork(referral({ api, coreSagas, networks }))
    yield fork(refresh())
    yield fork(request({ api, coreSagas, networks }))
    yield fork(recurringBuy({ api }))
    yield fork(resetWallet2fa({ api }))
    yield fork(send({ api, coreSagas, networks }))
    yield fork(sendCrypto({ api, coreSagas, networks }))
    yield fork(sendBch({ api, coreSagas, networks }))
    yield fork(sendBtc({ api, coreSagas, networks }))
    yield fork(sendEth({ api, coreSagas, networks }))
    yield fork(sendXlm({ api, coreSagas, networks }))
    yield fork(settings({ api, coreSagas }))
    yield fork(signMessage({ coreSagas }))
    yield fork(buySell({ api, coreSagas, networks }))
    yield fork(swap({ api, coreSagas, networks }))
    yield fork(taxCenter({ api }))
    yield fork(uploadDocuments({ api }))
    yield fork(withdraw({ api, coreSagas, networks }))
    yield fork(veriff({ api, coreSagas }))
  }
