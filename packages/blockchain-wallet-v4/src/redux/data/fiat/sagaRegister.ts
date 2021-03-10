import { fork } from 'redux-saga/effects'

import sagas from './sagas'

export default ({ api }) => {
  const dataFiatSagas = sagas({ api })

  return function * coreDataFiatSaga() {
    yield fork(dataFiatSagas.watchTransactions)
  }
}
