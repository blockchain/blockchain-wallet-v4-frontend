import bchTransactions from './bchTransactions/sagas'
import brokerage from './brokerage/sagas'
import btcTransactions from './btcTransactions/sagas'
import coinTransactions from './coinTransactions/sagas'
import ethTransactions from './ethTransactions/sagas'
import fiatTransactions from './fiatTransactions/sagas'
import fundRecovery from './fundRecovery/sagas'
import identityVerification from './identityVerification/sagas'
import importBtcAddress from './importBtcAddress/sagas'
import interest from './interest/sagas'
import interestUploadDocument from './interestUploadDocument/sagas'
import manageAddresses from './manageAddresses/sagas'
import onboarding from './onboarding/sagas'
import priceChart from './priceChart/sagas'
import recurringBuy from './recurringBuy/sagas'
import refresh from './refresh/sagas'
import request from './request/sagas'
import resetWallet2fa from './resetWallet2fa/sagas'
import send from './send/sagas'
import sendBch from './sendBch/sagas'
import sendBtc from './sendBtc/sagas'
import sendCrypto from './sendCrypto/sagas'
import sendEth from './sendEth/sagas'
import sendXlm from './sendXlm/sagas'
import settings from './settings/sagas'
import signMessage from './signMessage/sagas'
import simpleBuy from './simpleBuy/sagas'
import swap from './swap/sagas'
import uploadDocuments from './uploadDocuments/sagas'
import veriff from './veriff/sagas'
import withdraw from './withdraw/sagas'
import xlmTransactions from './xlmTransactions/sagas'

export default ({ api, coreSagas, networks }) => ({
  bchTransactions: bchTransactions(),
  brokerage: brokerage({ api, coreSagas, networks }),
  btcTransactions: btcTransactions(),
  coinTransactions: coinTransactions(),
  ethTransactions: ethTransactions(),
  fiatTransactions: fiatTransactions(),
  fundRecovery: fundRecovery({ api }),
  identityVerification: identityVerification({ api, coreSagas, networks }),
  importBtcAddress: importBtcAddress({ api, coreSagas, networks }),
  interest: interest({ api, coreSagas, networks }),
  interestUploadDocument: interestUploadDocument({ api }),
  manageAddresses: manageAddresses({ api, networks }),
  onboarding: onboarding(),
  priceChart: priceChart(),
  recurringBuy: recurringBuy({ api }),
  refresh: refresh(),
  request: request({ api, coreSagas, networks }),
  resetWallet2fa: resetWallet2fa({ api }),
  send: send({ api, coreSagas, networks }),
  sendBch: sendBch({ api, coreSagas, networks }),
  sendBtc: sendBtc({ api, coreSagas, networks }),
  sendCrypto: sendCrypto({ api }),
  sendEth: sendEth({ api, coreSagas, networks }),
  sendXlm: sendXlm({ api, coreSagas, networks }),
  settings: settings({ api, coreSagas }),
  signMessage: signMessage({ coreSagas }),
  simpleBuy: simpleBuy({ api, coreSagas, networks }),
  swap: swap({ api, coreSagas, networks }),
  uploadDocument: uploadDocuments({ api }),
  veriff: veriff({ api, coreSagas }),
  withdraw: withdraw({ api }),
  xlmTransactions: xlmTransactions()
})
