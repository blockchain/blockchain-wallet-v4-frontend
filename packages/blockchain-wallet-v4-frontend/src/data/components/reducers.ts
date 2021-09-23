import { combineReducers } from 'redux'

import { brokerageReducer as brokerage } from './brokerage/slice'
import { fundRecoveryReducer } from './fundRecovery/reducers'
import identityVerificationReducer from './identityVerification/reducers'
import { interestReducer } from './interest/slice'
import { reducer as interestUploadDocumentReducer } from './interestUploadDocument/slice'
import { layoutWalletReducer as layoutWallet } from './layoutWallet/slice'
import lockbox from './lockbox/reducers'
import manageAddresses from './manageAddresses/reducers'
import { priceChartReducer } from './priceChart/slice'
import { recoveryPhraseReducer } from './recoveryPhrase/reducers'
import { reducer as recurringBuy } from './recurringBuy/slice'
import { requestReducer } from './request/reducers'
import resetWallet2fa from './resetWallet2fa/reducers'
import { sendReducer } from './send/reducers'
import { sendBchReducer } from './sendBch/reducers'
import { sendBtcReducer } from './sendBtc/reducers'
import { reducer as sendCrypto } from './sendCrypto/slice'
import { sendEthReducer } from './sendEth/reducers'
import { sendXlmReducer } from './sendXlm/reducers'
import { settingsReducer } from './settings/slice'
import signMessage from './signMessage/reducers'
import { buySellReducer as buySell } from './simpleBuy/slice'
import swapReducer from './swap/reducers'
import uploadDocuments from './uploadDocuments/reducers'
import veriff from './veriff/reducers'
import { withdrawReducer } from './withdraw/reducers'

const componentReducer = combineReducers({
  brokerage,
  buySell,
  fundRecovery: fundRecoveryReducer,
  identityVerification: identityVerificationReducer,
  interest: interestReducer,
  interestUploadDocument: interestUploadDocumentReducer,
  layoutWallet,
  lockbox,
  manageAddresses,
  priceChart: priceChartReducer,
  recoveryPhrase: recoveryPhraseReducer,
  recurringBuy,
  request: requestReducer,
  resetWallet2fa,
  send: sendReducer,
  sendBch: sendBchReducer,
  sendBtc: sendBtcReducer,
  sendCrypto,
  sendEth: sendEthReducer,
  sendXlm: sendXlmReducer,
  settings: settingsReducer,
  signMessage,
  swap: swapReducer,
  uploadDocuments,
  veriff,
  withdraw: withdrawReducer
})

export default componentReducer
