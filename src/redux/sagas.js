import { fork } from 'redux-saga/effects'
import { feeSaga } from './data/Fee/sagas.js'
import { ratesSaga } from './data/Rates/sagas.js'
import { settingsSaga } from './settings/sagas.js'
import { transactionsSaga } from './data/Transactions/sagas.js'
import { commonSaga } from './common/sagas.js'
import { paymentSaga } from './data/payment/sagas'
import { walletSaga } from './wallet/sagas.js'

export const rootSaga = ({ api, dataPath, walletPath, settingsPath } = {}) => {
  return function * () {
    yield [
      fork(feeSaga({api})),
      fork(ratesSaga({api})),
      fork(settingsSaga({api})),
      fork(transactionsSaga({api, walletPath, dataPath})),
      fork(commonSaga({api})),
      fork(paymentSaga({api})),
      fork(walletSaga({api, walletPath}))
    ]
  }
}
