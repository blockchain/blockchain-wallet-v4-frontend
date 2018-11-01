import activityList from './activityList/sagas'
import bchTransactions from './bchTransactions/sagas'
import btcTransactions from './btcTransactions/sagas'
import ethTransactions from './ethTransactions/sagas'
import exchange from './exchange/shapeshift.sagas'
import exchangeHistory from './exchangeHistory/sagas'
import identityVerification from './identityVerification/sagas'
import importBtcAddress from './importBtcAddress/sagas'
import login from './login/sagas'
import manageAddresses from './manageAddresses/sagas'
import onfido from './onfido/sagas'
import priceChart from './priceChart/sagas'
import priceTicker from './priceTicker/sagas'
import refresh from './refresh/sagas'
import requestBtc from './requestBtc/sagas'
import requestBch from './requestBch/sagas'
import requestEth from './requestEth/sagas'
import sendBch from './sendBch/sagas'
import sendBtc from './sendBtc/sagas'
import sendEth from './sendEth/sagas'
import settings from './settings/sagas'
import signMessage from './signMessage/sagas'
import swapGetStarted from './swapGetStarted/sagas'
import transactionReport from './transactionReport/sagas'
import uploadDocuments from './uploadDocuments/sagas'

export default ({ api, coreSagas, options }) => ({
  activityList: activityList({ api, coreSagas }),
  bchTransactions: bchTransactions({ api, coreSagas }),
  btcTransactions: btcTransactions({ api, coreSagas }),
  ethTransactions: ethTransactions({ api, coreSagas }),
  exchange: exchange({ api, coreSagas, options }),
  exchangeHistory: exchangeHistory({ api, coreSagas }),
  identityVerification: identityVerification({ api, coreSagas }),
  onfido: onfido({ api, coreSagas }),
  importBtcAddress: importBtcAddress({ api, coreSagas }),
  login: login(),
  manageAddresses: manageAddresses({ api, coreSagas }),
  priceChart: priceChart({ coreSagas }),
  priceTicker: priceTicker({ coreSagas }),
  refresh: refresh(),
  requestBtc: requestBtc(),
  requestBch: requestBch(),
  requestEth: requestEth(),
  sendBch: sendBch({ api, coreSagas }),
  sendBtc: sendBtc({ api, coreSagas }),
  sendEth: sendEth({ api, coreSagas }),
  settings: settings({ api, coreSagas }),
  signMessage: signMessage({ coreSagas }),
  swapGetStarted: swapGetStarted({ coreSagas }),
  transactionReport: transactionReport({ api, coreSagas }),
  uploadDocument: uploadDocuments({ api })
})
