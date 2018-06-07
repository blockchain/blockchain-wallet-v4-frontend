import { combineReducers } from 'redux'
import exchangeReducer from './exchange/reducers'
import layoutWalletReducer from './layoutWallet/reducers'
import priceChartReducer from './priceChart/reducers'
import sendBchReducer from './sendBch/reducers'
import sendBtcReducer from './sendBtc/reducers'
import sendEthReducer from './sendEth/reducers'
import signMessageReducer from './signMessage/reducers'
import manageAddressesReducer from './manageAddresses/reducers'

export default combineReducers({
  exchange: exchangeReducer,
  layoutWallet: layoutWalletReducer,
  priceChart: priceChartReducer,
  sendBch: sendBchReducer,
  sendBtc: sendBtcReducer,
  sendEth: sendEthReducer,
  signMessage: signMessageReducer,
  manageAddresses: manageAddressesReducer
})
