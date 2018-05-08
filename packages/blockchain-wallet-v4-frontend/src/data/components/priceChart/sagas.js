import { put, select } from 'redux-saga/effects'
import * as S from './selectors'
import * as actions from '../../actions'
import { calculateStart, calculateScale } from 'services/ChartService'

/**
 * Price Chart Sagas
 * @return {Object} price chart sagas
 */
export default ({ coreSagas }) => {
  const logLocation = 'components/priceChart/sagas'

  /**
   * @desc initialize priceChart component and fetches price data based on coin and time
   * @property {action} foo this is description.
   */
  const initialized = function * (action) {
    try {
      const { coin, time } = action.payload
      const currency = 'USD'
      const start = calculateStart(coin, time)
      const scale = calculateScale(coin, time)
      yield put(actions.core.data.misc.fetchPriceIndexSeries(coin, currency, start, scale))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  /**
   * @desc click handler for priceChart component that fetches price data for new coin
   * @property {action} foo this is description.
   */
  const coinClicked = function * (action) {
    try {
      const { coin } = action.payload
      const currency = 'USD'
      const time = yield select(S.getTime)
      const start = calculateStart(coin, time)
      const scale = calculateScale(coin, time)
      yield put(actions.core.data.misc.fetchPriceIndexSeries(coin, currency, start, scale))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'coinClicked', e))
    }
  }

  /**
   * @desc click handler for priceChart component that fetches price data for when time is changed
   * @property {action} foo this is description.
   */
  const timeClicked = function * (action) {
    try {
      const { time } = action.payload
      const currency = 'USD'
      const coin = yield select(S.getCoin)
      const start = calculateStart(coin, time)
      const scale = calculateScale(coin, time)
      yield put(actions.core.data.misc.fetchPriceIndexSeries(coin, currency, start, scale))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'timeClicked', e))
    }
  }

  return {
    initialized,
    coinClicked,
    timeClicked
  }
}
