import { combineReducers } from 'redux'
import priceChartReducer from './priceChart/reducers'

export default combineReducers({
  price_chart: priceChartReducer
})
