import { combineReducers } from 'redux'
import exchangeReducer from './exchange/reducers'
import layoutWalletReducer from './layoutWallet/reducers'
import manageAddressesReducer from './manageAddresses/reducers'
import priceChartReducer from './priceChart/reducers'
import sendBchReducer from './sendBch/reducers'
import sendBtcReducer from './sendBtc/reducers'
import sendEthReducer from './sendEth/reducers'
import signMessageReducer from './signMessage/reducers'

export default combineReducers({
  exchange: exchangeReducer,
  layoutWallet: layoutWalletReducer,
  manageAddresses: manageAddressesReducer,
  priceChart: priceChartReducer,
  sendBch: sendBchReducer,
  sendBtc: sendBtcReducer,
  sendEth: sendEthReducer,
  signMessage: signMessageReducer
})
