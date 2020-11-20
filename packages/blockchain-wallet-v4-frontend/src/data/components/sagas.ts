import algoTransactions from './algoTransactions/sagas'
import bchTransactions from './bchTransactions/sagas'
import borrow from './borrow/sagas'
import btcTransactions from './btcTransactions/sagas'
import ethTransactions from './ethTransactions/sagas'
import exchange from './exchange/exchange.sagas'
import exchangeHistory from './exchangeHistory/sagas'
import fiatTransactions from './fiatTransactions/sagas'
import identityVerification from './identityVerification/sagas'
import importBtcAddress from './importBtcAddress/sagas'
import interest from './interest/sagas'
import manageAddresses from './manageAddresses/sagas'
import priceChart from './priceChart/sagas'
import priceTicker from './priceTicker/sagas'
import refresh from './refresh/sagas'
import requestBch from './requestBch/sagas'
import requestBtc from './requestBtc/sagas'
import requestEth from './requestEth/sagas'
import requestXlm from './requestXlm/sagas'
import send from './send/sagas'
import sendBch from './sendBch/sagas'
import sendBtc from './sendBtc/sagas'
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
  algoTransactions: algoTransactions(),
  bchTransactions: bchTransactions(),
  borrow: borrow({ api, coreSagas, networks }),
  btcTransactions: btcTransactions(),
  ethTransactions: ethTransactions(),
  xlmTransactions: xlmTransactions(),
  exchange: exchange({ api, coreSagas, networks }),
  exchangeHistory: exchangeHistory({ api }),
  fiatTransactions: fiatTransactions(),
  identityVerification: identityVerification({ api, coreSagas, networks }),
  interest: interest({ api, coreSagas, networks }),
  importBtcAddress: importBtcAddress({ api, coreSagas, networks }),
  manageAddresses: manageAddresses({ api, networks }),
  priceChart: priceChart(),
  priceTicker: priceTicker({ coreSagas }),
  refresh: refresh(),
  requestBtc: requestBtc(),
  requestBch: requestBch(),
  requestEth: requestEth(),
  requestXlm: requestXlm(),
  send: send({ api, coreSagas, networks }),
  sendBch: sendBch({ api, coreSagas, networks }),
  sendBtc: sendBtc({ api, coreSagas, networks }),
  sendEth: sendEth({ api, coreSagas, networks }),
  sendXlm: sendXlm({ api, coreSagas, networks }),
  settings: settings({ coreSagas }),
  signMessage: signMessage({ coreSagas }),
  simpleBuy: simpleBuy({ api, coreSagas, networks }),
  swap: swap({ api, coreSagas, networks }),
  uploadDocument: uploadDocuments({ api }),
  withdraw: withdraw({ api }),
  veriff: veriff({ api, coreSagas })
})
