import { fork } from 'redux-saga/effects'
import { advertsSaga } from './data/adverts/sagas.js'
import { captchaSaga } from './data/captcha/sagas.js'
import { chartsSaga } from './data/charts/sagas.js'
import { feeSaga } from './data/fee/sagas.js'
import { logsSaga } from './data/logs/sagas.js'
import { ratesSaga } from './data/rates/sagas.js'
import { settingsSaga } from './settings/sagas.js'
import { transactionsSaga } from './data/transactions/sagas.js'
import { paymentSaga } from './data/payment/sagas'
import { commonSaga } from './common/sagas.js'
import { walletSaga } from './wallet/sagas.js'
import { webSocketSaga } from './webSocket/sagas.js'

export const rootSaga = ({ api, dataPath, walletPath, settingsPath, socket } = {}) => {
  return function * () {
    yield [
      fork(advertsSaga({api})),
      fork(captchaSaga({ api })),
      fork(chartsSaga({ api })),
      fork(feeSaga({api})),
      fork(logsSaga({ api })),
      fork(ratesSaga({api})),
      fork(settingsSaga({api})),
      fork(transactionsSaga({api, walletPath, dataPath})),
      fork(commonSaga({api})),
      fork(paymentSaga({api, walletPath, dataPath})),
      fork(walletSaga({api, walletPath})),
      fork(webSocketSaga({socket, walletPath, dataPath, api}))
    ]
  }
}
