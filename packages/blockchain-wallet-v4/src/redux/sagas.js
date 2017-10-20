import { advertsSaga } from './data/adverts/sagas.js'
import { captchaSaga } from './data/captcha/sagas.js'
import { chartsSaga } from './data/charts/sagas.js'
import { feeSaga } from './data/fee/sagas.js'
import { logsSaga } from './data/logs/sagas.js'
import { ratesSaga } from './data/rates/sagas.js'
import { transactionsSaga } from './data/transactions/sagas.js'
import { transactionFiatsSaga } from './data/transactionFiats/sagas.js'
import { paymentSaga } from './data/payment/sagas'
import { reportsSagas } from './data/reports/sagas'
import { commonSaga } from './common/sagas.js'
import { settingsSaga } from './settings/sagas.js'
import { walletSaga } from './wallet/sagas.js'
import { webSocketSaga } from './webSocket/sagas.js'
import { walletOptionsSaga } from './walletOptions/sagas.js'
import { kvStoreSagasFactory } from './kvStore/sagas.js'

export const coreSagasFactory = ({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket } = {}) => ({
  adverts: advertsSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  captcha: captchaSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  charts: chartsSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  fee: feeSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  logs: logsSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  rates: ratesSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  transactions: transactionsSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  transactionFiats: transactionFiatsSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  payment: paymentSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  reports: reportsSagas({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  common: commonSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  settings: settingsSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  wallet: walletSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  walletOptions: walletOptionsSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  webSocket: webSocketSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  kvStore: kvStoreSagasFactory({ kvStoreApi, kvStorePath, walletPath })
})
