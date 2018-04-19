import { combineReducers } from 'redux'
import exchangeReducer from './exchange/reducers'
import priceChartReducer from './priceChart/reducers'
import sendBtcReducer from './sendBtc/reducers'

export default combineReducers({
  exchange: exchangeReducer,
  price_chart: priceChartReducer,
  sendBtc: sendBtcReducer
})
