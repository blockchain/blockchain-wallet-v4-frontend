import * as bchTransactions from './bchTransactions/actions'
import { actions as brokerage } from './brokerage/slice'
import * as btcTransactions from './btcTransactions/actions'
import * as coinTransactions from './coinTransactions/actions'
import * as ethTransactions from './ethTransactions/actions'
import * as fiatTransactions from './fiatTransactions/actions'
import * as fundRecovery from './fundRecovery/actions'
import * as identityVerification from './identityVerification/actions'
import * as importBtcAddress from './importBtcAddress/actions'
import { actions as interest } from './interest/slice'
import { actions as interestUploadDocument } from './interestUploadDocument/slice'
import { actions as layoutWallet } from './layoutWallet/slice'
import * as lockbox from './lockbox/actions'
import * as manageAddresses from './manageAddresses/actions'
import * as onboarding from './onboarding/actions'
import { actions as priceChart } from './priceChart/slice'
import * as recoveryPhrase from './recoveryPhrase/actions'
import { actions as recurringBuy } from './recurringBuy/slice'
import * as refresh from './refresh/actions'
import * as request from './request/actions'
import * as resetWallet2fa from './resetWallet2fa/actions'
import * as send from './send/actions'
import * as sendBch from './sendBch/actions'
import * as sendBtc from './sendBtc/actions'
import { actions as sendCrypto } from './sendCrypto/slice'
import * as sendEth from './sendEth/actions'
import * as sendXlm from './sendXlm/actions'
import { actions as settings } from './settings/slice'
import * as signMessage from './signMessage/actions'
import * as simpleBuy from './simpleBuy/actions'
import * as swap from './swap/actions'
import * as uploadDocuments from './uploadDocuments/actions'
import * as veriff from './veriff/actions'
import * as withdraw from './withdraw/actions'
import * as xlmTransactions from './xlmTransactions/actions'

export {
  bchTransactions,
  brokerage,
  btcTransactions,
  coinTransactions,
  ethTransactions,
  fiatTransactions,
  fundRecovery,
  identityVerification,
  importBtcAddress,
  interest,
  interestUploadDocument,
  layoutWallet,
  lockbox,
  manageAddresses,
  onboarding,
  priceChart,
  recoveryPhrase,
  recurringBuy,
  refresh,
  request,
  resetWallet2fa,
  send,
  sendBch,
  sendBtc,
  sendCrypto,
  sendEth,
  sendXlm,
  settings,
  signMessage,
  simpleBuy,
  swap,
  uploadDocuments,
  veriff,
  withdraw,
  xlmTransactions
}
