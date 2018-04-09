import { fork } from 'redux-saga/effects'
import exchangeSaga from './exchange/sagas'
import priceChartSaga from './priceChart/sagas'
import priceTickerSaga from './priceTicker/sagas'

export default function* () {
  yield fork(exchangeSaga),
  yield fork(priceChartSaga),
  yield fork(priceTickerSaga)
}
