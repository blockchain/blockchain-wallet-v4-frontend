import { all, fork } from 'redux-saga/effects'

import exchange from './exchange/sagas'
import priceChart from './priceChart/sagas'
import priceTicker from './priceTicker/sagas'
import sendBch from './sendBch/sagas'
import sendBtc from './sendBtc/sagas'
import sendEth from './sendEth/sagas'
import signMessage from './signMessage/sagas'

export default ({ api, coreSagas }) => function * () {
  yield all([
    yield fork(exchange({ api, coreSagas })),
    yield fork(priceChart({ coreSagas })),
    yield fork(priceTicker({ coreSagas })),
    yield fork(sendBch({ api, coreSagas })),
    yield fork(sendBtc({ api, coreSagas })),
    yield fork(sendEth({ api, coreSagas })),
    yield fork(signMessage({ coreSagas }))
  ])
}
