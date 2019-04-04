import { put, select, take } from 'redux-saga/effects'
import * as S from './selectors'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import * as selectors from '../../selectors'
import { Remote } from 'blockchain-wallet-v4/src'
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
      const settingsR = yield select(selectors.core.settings.getSettings)
      if (!Remote.Success.is(settingsR)) {
        yield take(actionTypes.core.settings.FETCH_SETTINGS_SUCCESS)
      }
      const currencyR = yield select(selectors.core.settings.getCurrency)
      const { coin, time } = action.payload
      const start = calculateStart(coin, time)
      const scale = calculateScale(coin, time)
      yield put(
        actions.core.data.misc.fetchPriceIndexSeries(
          coin,
          currencyR.getOrElse('USD'),
          start,
          scale
        )
      )
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
      const currencyR = yield select(selectors.core.settings.getCurrency)
      const time = yield select(S.getTime)
      const start = calculateStart(coin, time)
      const scale = calculateScale(coin, time)
      yield put(
        actions.core.data.misc.fetchPriceIndexSeries(
          coin,
          currencyR.getOrElse('USD'),
          start,
          scale
        )
      )
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
      const currencyR = yield select(selectors.core.settings.getCurrency)
      const coin = yield select(S.getCoin)
      const start = calculateStart(coin, time)
      const scale = calculateScale(coin, time)
      yield put(
        actions.core.data.misc.fetchPriceIndexSeries(
          coin,
          currencyR.getOrElse('USD'),
          start,
          scale
        )
      )
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
