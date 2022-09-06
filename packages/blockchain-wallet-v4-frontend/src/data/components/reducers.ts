import { combineReducers } from 'redux'

import { brokerageReducer as brokerage } from './brokerage/slice'
import { buySellReducer as buySell } from './buySell/slice'
import { debitCardReducer } from './debitCard/slice'
import { dexReducer } from './dex/slice'
import { fundRecoveryReducer } from './fundRecovery/reducers'
import { identityVerificationReducer } from './identityVerification/slice'
import { interestReducer } from './interest/slice'
import { reducer as interestUploadDocumentReducer } from './interestUploadDocument/slice'
import { layoutWalletReducer as layoutWallet } from './layoutWallet/slice'
import manageAddresses from './manageAddresses/reducers'
import { nftsReducer } from './nfts/slice'
import { priceChartReducer } from './priceChart/slice'
import { recoveryPhraseReducer } from './recoveryPhrase/reducers'
import { reducer as recurringBuy } from './recurringBuy/slice'
import { referralReducer } from './referral/slice'
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
import { swapSliceReducer as swap } from './swap/slice'
import { taxCenterReducer } from './taxCenter/slice'
import { reducer as termsAndConditions } from './termsAndConditions/slice'
import uploadDocuments from './uploadDocuments/reducers'
import veriff from './veriff/reducers'
import { withdrawReducer as withdraw } from './withdraw/slice'

const componentReducer = combineReducers({
  brokerage,
  buySell,
  debitCard: debitCardReducer,
  dex: dexReducer,
  fundRecovery: fundRecoveryReducer,
  identityVerification: identityVerificationReducer,
  interest: interestReducer,
  interestUploadDocument: interestUploadDocumentReducer,
  layoutWallet,
  manageAddresses,
  nfts: nftsReducer,
  priceChart: priceChartReducer,
  recoveryPhrase: recoveryPhraseReducer,
  recurringBuy,
  referral: referralReducer,
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
  swap,
  taxCenter: taxCenterReducer,
  termsAndConditions,
  uploadDocuments,
  veriff,
  withdraw
})

export default componentReducer
