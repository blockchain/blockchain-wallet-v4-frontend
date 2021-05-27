import { combineReducers } from 'redux'

import { borrowReducer } from './borrow/reducers'
import { brokerageReducer } from './brokerage/reducers'
import { identityVerificationReducer } from './identityVerification/reducers'
import interestReducer from './interest/reducers'
import layoutWallet from './layoutWallet/reducers'
import lockbox from './lockbox/reducers'
import manageAddresses from './manageAddresses/reducers'
import { priceChartReducer } from './priceChart/reducers'
import { recoveryPhraseReducer } from './recoveryPhrase/reducers'
import remindWalletGuid from './remindWalletGuid/reducers'
import { requestReducer } from './request/reducers'
import resetWallet2fa from './resetWallet2fa/reducers'
import { sendReducer } from './send/reducers'
import { sendBchReducer } from './sendBch/reducers'
import { sendBtcReducer } from './sendBtc/reducers'
import { sendEthReducer } from './sendEth/reducers'
import { sendXlmReducer } from './sendXlm/reducers'
import { settingsReducer } from './settings/reducers'
import signMessage from './signMessage/reducers'
import { simpleBuyReducer } from './simpleBuy/reducers'
import { swapReducer } from './swap/reducers'
import uploadDocuments from './uploadDocuments/reducers'
import veriff from './veriff/reducers'
import { withdrawReducer } from './withdraw/reducers'

const componentReducer = combineReducers({
  borrow: borrowReducer,
  brokerage: brokerageReducer,
  identityVerification: identityVerificationReducer,
  interest: interestReducer,
  layoutWallet,
  lockbox,
  manageAddresses,
  priceChart: priceChartReducer,
  recoveryPhrase: recoveryPhraseReducer,
  remindWalletGuid,
  request: requestReducer,
  resetWallet2fa,
  send: sendReducer,
  sendBch: sendBchReducer,
  sendBtc: sendBtcReducer,
  sendEth: sendEthReducer,
  sendXlm: sendXlmReducer,
  settings: settingsReducer,
  signMessage,
  simpleBuy: simpleBuyReducer,
  swap: swapReducer,
  uploadDocuments,
  veriff,
  withdraw: withdrawReducer,
})

export default componentReducer
