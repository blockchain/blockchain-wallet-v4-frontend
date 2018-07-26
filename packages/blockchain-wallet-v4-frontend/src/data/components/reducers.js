import { combineReducers } from 'redux'
import identityVerification from './identityVerification/reducers'
import exchange from './exchange/reducers'
import layoutWallet from './layoutWallet/reducers'
import manageAddresses from './manageAddresses/reducers'
import onfido from './onfido/reducers'
import priceChart from './priceChart/reducers'
import sendBch from './sendBch/reducers'
import sendBtc from './sendBtc/reducers'
import sendEth from './sendEth/reducers'
import signMessage from './signMessage/reducers'

export default combineReducers({
  identityVerification,
  exchange,
  layoutWallet,
  manageAddresses,
  onfido,
  priceChart,
  sendBch,
  sendBtc,
  sendEth,
  signMessage
})
