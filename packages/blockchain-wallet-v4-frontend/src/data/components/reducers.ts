import { borrowReducer } from './borrow/reducers'
import { combineReducers } from 'redux'
import { exchangeHistoryReducer } from './exchangeHistory/reducers'
import { exchangeReducer } from './exchange/reducers'
import { identityVerificationReducer } from './identityVerification/reducers'
import { interestReducer } from './interest/reducers'
import { recoveryPhraseReducer } from './recoveryPhrase/reducers'
import { sendBchReducer } from './sendBch/reducers'
import { sendBtcReducer } from './sendBtc/reducers'
import { sendEthReducer } from './sendEth/reducers'
import { sendReducer } from './send/reducers'
import { sendXlmReducer } from './sendXlm/reducers'
import { simpleBuyReducer } from './simpleBuy/reducers'
import { withdrawReducer } from './withdraw/reducers'
import layoutWallet from './layoutWallet/reducers'
import lockbox from './lockbox/reducers'
import manageAddresses from './manageAddresses/reducers'
import onfido from './onfido/reducers'
import priceChart from './priceChart/reducers'
import signMessage from './signMessage/reducers'
import uploadDocuments from './uploadDocuments/reducers'
import veriff from './veriff/reducers'

const componentReducer = combineReducers({
  borrow: borrowReducer,
  exchange: exchangeReducer,
  exchangeHistory: exchangeHistoryReducer,
  identityVerification: identityVerificationReducer,
  interest: interestReducer,
  layoutWallet,
  lockbox,
  manageAddresses,
  onfido,
  priceChart,
  recoveryPhrase: recoveryPhraseReducer,
  send: sendReducer,
  sendBch: sendBchReducer,
  sendBtc: sendBtcReducer,
  sendEth: sendEthReducer,
  sendXlm: sendXlmReducer,
  signMessage,
  simpleBuy: simpleBuyReducer,
  uploadDocuments,
  withdraw: withdrawReducer,
  veriff
})

export default componentReducer
