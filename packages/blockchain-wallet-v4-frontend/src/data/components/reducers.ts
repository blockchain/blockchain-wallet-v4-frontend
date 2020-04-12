import { borrowReducer } from './borrow/reducers'
import { combineReducers } from 'redux'
import { exchangeReducer } from './exchange/reducers'
import { identityVerificationReducer } from './identityVerification/reducers'
import { recoveryPhraseReducer } from './recoveryPhrase/reducers'
import { sendBchReducer } from './sendBch/reducers'
import { sendBtcReducer } from './sendBtc/reducers'
import { sendEthReducer } from './sendEth/reducers'
import { sendXlmReducer } from './sendXlm/reducers'
import { simpleBuyReducer } from './simpleBuy/reducers'
import exchangeHistory from './exchangeHistory/reducers'
import layoutWallet from './layoutWallet/reducers'
import lockbox from './lockbox/reducers'
import manageAddresses from './manageAddresses/reducers'
import onboarding from './onboarding/reducers'
import onfido from './onfido/reducers'
import priceChart from './priceChart/reducers'
import send from './send/reducers'
import signMessage from './signMessage/reducers'
import uploadDocuments from './uploadDocuments/reducers'
import veriff from './veriff/reducers'

const componentReducer = combineReducers({
  borrow: borrowReducer,
  exchange: exchangeReducer,
  exchangeHistory,
  identityVerification: identityVerificationReducer,
  layoutWallet,
  lockbox,
  manageAddresses,
  onboarding,
  onfido,
  priceChart,
  recoveryPhrase: recoveryPhraseReducer,
  send,
  sendBch: sendBchReducer,
  sendBtc: sendBtcReducer,
  sendEth: sendEthReducer,
  sendXlm: sendXlmReducer,
  signMessage,
  simpleBuy: simpleBuyReducer,
  uploadDocuments,
  veriff
})

export default componentReducer
