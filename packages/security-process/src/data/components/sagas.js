import activityList from './activityList/sagas'
import bchTransactions from './bchTransactions/sagas'
import btcTransactions from './btcTransactions/sagas'
import coinify from './coinify/sagas'
import ethTransactions from './ethTransactions/sagas'
import xlmTransactions from './xlmTransactions/sagas'
import exchange from './exchange/exchange.sagas'
import exchangeHistory from './exchangeHistory/sagas'
import identityVerification from './identityVerification/sagas'
import importBtcAddress from './importBtcAddress/sagas'
import manageAddresses from './manageAddresses/sagas'
import onboarding from './onboarding/sagas'
import onfido from './onfido/sagas'
import priceChart from './priceChart/sagas'
import priceTicker from './priceTicker/sagas'
import refresh from './refresh/sagas'
import requestBtc from './requestBtc/sagas'
import requestBch from './requestBch/sagas'
import requestEth from './requestEth/sagas'
import requestXlm from './requestXlm/sagas'
import sendBch from './sendBch/sagas'
import sendBtc from './sendBtc/sagas'
import sendEth from './sendEth/sagas'
import sendXlm from './sendXlm/sagas'
import settings from './settings/sagas'
import signMessage from './signMessage/sagas'
import transactionReport from './transactionReport/sagas'
import uploadDocuments from './uploadDocuments/sagas'
import veriff from './veriff/sagas'

export default ({ api, coreSagas, networks }) => ({
  activityList: activityList(),
  bchTransactions: bchTransactions(),
  btcTransactions: btcTransactions(),
  coinify: coinify({ api, coreSagas }),
  ethTransactions: ethTransactions(),
  xlmTransactions: xlmTransactions(),
  exchange: exchange({ api, coreSagas, networks }),
  exchangeHistory: exchangeHistory({ api, coreSagas }),
  identityVerification: identityVerification({ api, coreSagas }),
  importBtcAddress: importBtcAddress({ api, coreSagas, networks }),
  manageAddresses: manageAddresses({ api, networks }),
  onboarding: onboarding(),
  onfido: onfido({ api }),
  priceChart: priceChart({ coreSagas }),
  priceTicker: priceTicker({ coreSagas }),
  refresh: refresh(),
  requestBtc: requestBtc(),
  requestBch: requestBch(),
  requestEth: requestEth(),
  requestXlm: requestXlm(),
  sendBch: sendBch({ coreSagas, networks }),
  sendBtc: sendBtc({ coreSagas, networks }),
  sendEth: sendEth({ api, coreSagas, networks }),
  sendXlm: sendXlm({ api, coreSagas }),
  settings: settings({ coreSagas }),
  signMessage: signMessage({ coreSagas }),
  transactionReport: transactionReport({ coreSagas }),
  uploadDocument: uploadDocuments({ api }),
  veriff: veriff({ api, coreSagas })
})
