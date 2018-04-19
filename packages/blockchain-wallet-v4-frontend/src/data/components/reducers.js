import { combineReducers } from 'redux'
import exchangeReducer from './exchange/reducers'
import priceChartReducer from './priceChart/reducers'
import sendBtcReducer from './sendBtc/reducers'
import sendEthReducer from './sendEth/reducers'

export default combineReducers({
  exchange: exchangeReducer,
  price_chart: priceChartReducer,
  sendBtc: sendBtcReducer,
  sendEth: sendEthReducer
})
