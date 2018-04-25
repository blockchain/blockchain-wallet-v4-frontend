import { combineReducers } from 'redux'
import exchangeReducer from './exchange/reducers'
import priceChartReducer from './priceChart/reducers'
import sendBchReducer from './sendBch/reducers'
import sendBtcReducer from './sendBtc/reducers'
import sendEthReducer from './sendEth/reducers'
import signMessageReducer from './signMessage/reducers'

export default combineReducers({
  exchange: exchangeReducer,
  price_chart: priceChartReducer,
  sendBch: sendBchReducer,
  sendBtc: sendBtcReducer,
  sendEth: sendEthReducer,
  signMessage: signMessageReducer
})
