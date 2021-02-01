import { borrowReducer } from './borrow/reducers'
import { combineReducers } from 'redux'
import { identityVerificationReducer } from './identityVerification/reducers'
import { interestReducer } from './interest/reducers'
import { priceChartReducer } from './priceChart/reducers'
import { recoveryPhraseReducer } from './recoveryPhrase/reducers'
import { sendBchReducer } from './sendBch/reducers'
import { sendBtcReducer } from './sendBtc/reducers'
import { sendEthReducer } from './sendEth/reducers'
import { sendReducer } from './send/reducers'
import { sendXlmReducer } from './sendXlm/reducers'
import { simpleBuyReducer } from './simpleBuy/reducers'
import { swapReducer } from './swap/reducers'
import { withdrawReducer } from './withdraw/reducers'
import layoutWallet from './layoutWallet/reducers'
import lockbox from './lockbox/reducers'
import manageAddresses from './manageAddresses/reducers'
import signMessage from './signMessage/reducers'
import uploadDocuments from './uploadDocuments/reducers'
import veriff from './veriff/reducers'

const componentReducer = combineReducers({
  borrow: borrowReducer,
  identityVerification: identityVerificationReducer,
  interest: interestReducer,
  layoutWallet,
  lockbox,
  manageAddresses,
  priceChart: priceChartReducer,
  recoveryPhrase: recoveryPhraseReducer,
  send: sendReducer,
  sendBch: sendBchReducer,
  sendBtc: sendBtcReducer,
  sendEth: sendEthReducer,
  sendXlm: sendXlmReducer,
  signMessage,
  simpleBuy: simpleBuyReducer,
  swap: swapReducer,
  uploadDocuments,
  withdraw: withdrawReducer,
  veriff
})

export default componentReducer
