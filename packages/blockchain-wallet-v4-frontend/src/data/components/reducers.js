import { combineReducers } from 'redux'
import identityVerification from './identityVerification/reducers'
import exchange from './exchange/reducers'
import lockbox from './lockbox/reducers'
import exchangeHistory from './exchangeHistory/reducers'
import layoutWallet from './layoutWallet/reducers'
import manageAddresses from './manageAddresses/reducers'
import onfido from './onfido/reducers'
import priceChart from './priceChart/reducers'
import sendBch from './sendBch/reducers'
import sendBtc from './sendBtc/reducers'
import sendBsv from './sendBsv/reducers'
import sendEth from './sendEth/reducers'
import sendXlm from './sendXlm/reducers'
import signMessage from './signMessage/reducers'
import uploadDocuments from './uploadDocuments/reducers'
import veriff from './veriff/reducers'

export default combineReducers({
  identityVerification,
  exchange,
  exchangeHistory,
  layoutWallet,
  lockbox,
  manageAddresses,
  onfido,
  priceChart,
  sendBch,
  sendBtc,
  sendBsv,
  sendEth,
  sendXlm,
  signMessage,
  uploadDocuments,
  veriff
})
