import { all, fork } from 'redux-saga/effects'
import exchange from './exchange/sagas'
import priceChart from './priceChart/sagas'
import priceTicker from './priceTicker/sagas'

export default ({ api, coreSagas }) => function * () {
  yield all([
    yield fork(exchange({ api, coreSagas })),
    yield fork(priceChart({ coreSagas })),
    yield fork(priceTicker({ coreSagas }))
  ])
}
