import activityList from './activityList/sagas'
import bchTransactions from './bchTransactions/sagas'
import btcTransactions from './btcTransactions/sagas'
import ethTransactions from './ethTransactions/sagas'
import xlmTransactions from './xlmTransactions/sagas'
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
import sendXlm from './sendXlm/sagas'
import settings from './settings/sagas'
import signMessage from './signMessage/sagas'
import transactionReport from './transactionReport/sagas'
import uploadDocuments from './uploadDocuments/sagas'

export default ({ api, coreSagas, options, networks }) => ({
  activityList: activityList(),
  bchTransactions: bchTransactions(),
  btcTransactions: btcTransactions(),
  ethTransactions: ethTransactions(),
  xlmTransactions: xlmTransactions(),
  exchange: exchange({ api, coreSagas, options, networks }),
  exchangeHistory: exchangeHistory({ api, coreSagas }),
  identityVerification: identityVerification({ api, coreSagas }),
  onfido: onfido({ api }),
  importBtcAddress: importBtcAddress({ api, coreSagas, networks }),
  login: login(),
  manageAddresses: manageAddresses({ api, networks }),
  priceChart: priceChart({ coreSagas }),
  priceTicker: priceTicker({ coreSagas }),
  refresh: refresh(),
  requestBtc: requestBtc(),
  requestBch: requestBch(),
  requestEth: requestEth(),
  sendBch: sendBch({ api, coreSagas }),
  sendBtc: sendBtc({ api, coreSagas }),
  sendEth: sendEth({ api, coreSagas }),
  sendXlm: sendXlm({ coreSagas }),
  settings: settings({ api, coreSagas }),
  signMessage: signMessage({ coreSagas }),
  transactionReport: transactionReport({ coreSagas }),
  uploadDocument: uploadDocuments({ api })
})
