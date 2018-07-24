import activityList from './activityList/sagas'
import bchTransactions from './bchTransactions/sagas'
import btcTransactions from './btcTransactions/sagas'
import ethTransactions from './ethTransactions/sagas'
import exchange from './exchange/sagas'
import exchangeHistory from './exchangeHistory/sagas'
import importBtcAddress from './importBtcAddress/sagas'
import manageAddresses from './manageAddresses/sagas'
import priceChart from './priceChart/sagas'
import priceTicker from './priceTicker/sagas'
import requestBtc from './requestBtc/sagas'
import sendBch from './sendBch/sagas'
import sendBtc from './sendBtc/sagas'
import sendEth from './sendEth/sagas'
import signMessage from './signMessage/sagas'
import transactionReport from './transactionReport/sagas'

export default ({ api, coreSagas }) => ({
  activityList: activityList({ api, coreSagas }),
  bchTransactions: bchTransactions({ api, coreSagas }),
  btcTransactions: btcTransactions({ api, coreSagas }),
  ethTransactions: ethTransactions({ api, coreSagas }),
  exchange: exchange({ api, coreSagas }),
  exchangeHistory: exchangeHistory({ api, coreSagas }),
  importBtcAddress: importBtcAddress({ api, coreSagas }),
  manageAddresses: manageAddresses({ api, coreSagas }),
  priceChart: priceChart({ coreSagas }),
  priceTicker: priceTicker({ coreSagas }),
  requestBtc: requestBtc(),
  sendBch: sendBch({ api, coreSagas }),
  sendBtc: sendBtc({ api, coreSagas }),
  sendEth: sendEth({ api, coreSagas }),
  signMessage: signMessage({ coreSagas }),
  transactionReport: transactionReport({ api, coreSagas })
})
