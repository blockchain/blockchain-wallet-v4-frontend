import { fork } from 'redux-saga/effects'
import priceChartSaga from './priceChart/sagas'
import priceTickerSaga from './priceTicker/sagas'

export default function * () {
  yield fork(priceChartSaga),
  yield fork(priceTickerSaga)
}
