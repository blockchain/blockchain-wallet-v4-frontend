import { fork } from 'redux-saga/effects'
import { ratesSaga } from './data/Rates/sagas.js'
import { settingsSaga } from './settings/sagas.js'
import { transactionsSaga } from './data/Transactions/sagas.js'
import { commonSaga } from './common/sagas.js'
import { walletSaga } from './wallet/sagas.js'

export const rootSaga = ({ api, dataPath, walletPath, settingsPath } = {}) => {
  return function * () {
    yield [
      fork(ratesSaga({api})),
      fork(settingsSaga({api})),
      fork(transactionsSaga({api, walletPath, dataPath})),
      fork(commonSaga({api})),
      fork(walletSaga({api, walletPath}))
    ]
  }
}
