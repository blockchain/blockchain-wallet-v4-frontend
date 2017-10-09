import { fork } from 'redux-saga/effects'
import { advertsSaga } from './data/adverts/sagas.js'
import { captchaSaga } from './data/captcha/sagas.js'
import { chartsSaga } from './data/charts/sagas.js'
import { feeSaga } from './data/fee/sagas.js'
import { logsSaga } from './data/logs/sagas.js'
import { ratesSaga } from './data/rates/sagas.js'
import { transactionsSaga } from './data/transactions/sagas.js'
import { paymentSaga } from './data/payment/sagas'
import { commonSaga } from './common/sagas.js'
import { webSocketSaga } from './webSocket/sagas.js'

export const rootSaga = ({ api, dataPath, walletPath, settingsPath, socket } = {}) => {
  return function * () {
    yield [
      fork(webSocketSaga({socket, walletPath, dataPath, api}))
    ]
  }
}
