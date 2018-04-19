import { combineReducers } from 'redux'
import exchangeReducer from './exchange/reducers'
import priceChartReducer from './priceChart/reducers'

export default combineReducers({
  exchange: exchangeReducer,
  price_chart: priceChartReducer
})
