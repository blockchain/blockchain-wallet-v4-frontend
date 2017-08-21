import { fork } from 'redux-saga/effects'
import { feeSaga } from './data/Fee/sagas.js'
import { advertsSaga } from './data/Adverts/sagas.js'
import { ratesSaga } from './data/Rates/sagas.js'
import { settingsSaga } from './settings/sagas.js'
import { transactionsSaga } from './data/Transactions/sagas.js'
import { commonSaga } from './common/sagas.js'
import { paymentSaga } from './data/Payment/sagas'
import { walletSaga } from './wallet/sagas.js'
import { webSocketSaga } from './webSocket/sagas.js'

export const rootSaga = ({ api, dataPath, walletPath, settingsPath, socket } = {}) => {
  return function * () {
    yield [
      fork(advertsSaga({api})),
      fork(feeSaga({api})),
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
