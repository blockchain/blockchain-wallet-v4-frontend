import { adverts } from './adverts/sagas.js'
import { captcha } from './captcha/sagas.js'
import { charts } from './charts/sagas.js'
import { fee } from './fee/sagas.js'
import { info } from './info/sagas.js'
import { logs } from './logs/sagas.js'
import { payment } from './payment/sagas.js'
import { rates } from './rates/sagas.js'
import { reports } from './reports/sagas.js'
import { transactionFiats } from './transactionFiats/sagas.js'
import { transactions } from './transactions/sagas.js'

export const dataSagasFactory = ({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket } = {}) => ({
  adverts: adverts({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  captcha: captcha({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  charts: charts({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  fee: fee({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  info: info({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  logs: logs({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  payment: payment({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  rates: rates({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  reports: reports({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  transactionFiats: transactionFiats({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  transactions: transactions({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket })
})
