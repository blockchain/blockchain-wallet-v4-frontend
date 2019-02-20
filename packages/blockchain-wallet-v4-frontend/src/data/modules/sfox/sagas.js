import { apply, put, call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as A from './actions'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
import * as modalActions from '../../modals/actions'
import * as modalSelectors from '../../modals/selectors'
import * as C from 'services/AlertService'
import * as CC from 'services/ConfirmService'
import { promptForSecondPassword, confirm } from 'services/SagaService'
import { path, prop, equals, head } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

export const sellDescription = `Exchange Trade SFX-`
export const logLocation = 'modules/sfox/sagas'
export const missingJumioToken = 'missing_jumio_token'

export default ({ api, coreSagas, networks }) => {
  const setBankManually = function*(action) {
    try {
      yield put(A.sfoxLoading())
      yield call(coreSagas.data.sfox.setBankManually, action.payload)
      const accounts = yield select(selectors.core.data.sfox.getAccounts)
      if (accounts.error) {
        throw new Error(JSON.parse(accounts.error).error)
      }
      yield put(A.sfoxSuccess())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'setBankManually', e))
      yield put(A.sfoxFailure(e))
    }
  }

  const sfoxSignup = function*() {
    try {
      yield put(A.sfoxLoading())
      yield call(coreSagas.data.sfox.signup)
      const profile = yield select(selectors.core.data.sfox.getProfile)
      if (!profile.error) {
        yield put(A.sfoxSuccess())
        yield put(A.enableSiftScience())
        yield put(A.nextStep('verify'))
      } else {
        yield put(A.sfoxNotAsked())
        throw new Error(JSON.parse(profile.error).error)
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'sfoxSignup', e))
      yield put(A.sfoxFailure(e))
    }
  }

  const setProfile = function*(payload) {
    try {
      yield call(coreSagas.data.sfox.setProfile, payload)

      const profile = yield select(selectors.core.data.sfox.getProfile)
      if (profile.error) {
        throw new Error(profile.error)
      } else {
        if (profile.data.verificationStatus.required_docs.length) {
          yield put(A.nextStep('upload'))
        } else {
          yield put(A.nextStep('funding'))
        }
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'setProfile', e))
      yield put(A.setVerifyError(e))
    }
  }

  const upload = function*(payload) {
    try {
      yield call(coreSagas.data.sfox.uploadDoc, payload)

      const profile = yield select(selectors.core.data.sfox.getProfile)
      if (!profile.data.verificationStatus.required_docs.length) {
        yield put(A.nextStep('jumio'))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'upload', e))
      yield put(actions.alerts.displayError(C.DOCUMENT_UPLOAD_ERROR))
    }
  }

  const setBank = function*(payload) {
    try {
      const setBankResult = yield call(
        coreSagas.data.sfox.setBankAccount,
        payload
      )
      if (!setBankResult) {
        yield put(
          A.sfoxFailure({ message: 'There was an error linking your bank' })
        )
      } else {
        yield put(actions.alerts.displaySuccess(C.BANK_ACCOUNT_SET_SUCCESS))
        yield put(modalActions.closeAllModals())
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'setBank', e))
    }
  }

  const submitMicroDeposits = function*(payload) {
    try {
      yield put(A.sfoxLoading())
      const result = yield call(
        coreSagas.data.sfox.verifyMicroDeposits,
        payload
      )
      if (result.status === 'active') {
        yield put(A.sfoxSuccess())
        yield call(delay, 1500)
        yield put(modalActions.closeAllModals())
      } else {
        yield put(A.sfoxNotAsked())
        throw new Error(result)
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'submitMicroDeposits', e)
      )
      yield put(A.sfoxFailure(e))
    }
  }

  const submitQuote = function*(action) {
    try {
      yield put(A.sfoxLoading())
      const nextAddressData = yield call(prepareAddress)
      const trade = yield call(
        coreSagas.data.sfox.handleTrade,
        action.payload,
        nextAddressData
      )
      if (prop('message', trade) || prop('name', trade) === 'AssertionError') {
        if (trade.message === 'QUOTE_EXPIRED') {
          throw new Error(
            "The quote has expired. If this continues to happen, we recommend automatically setting your computer's date & time."
          )
        }
        throw new Error(trade.message)
      }
      yield put(A.sfoxSuccess())
      yield put(A.enableSiftScience())
      const phoneCallRequestSentR = yield select(
        selectors.core.kvStore.buySell.getSfoxPhoneCall
      )
      const phoneCallRequestSent = phoneCallRequestSentR.getOrElse(true)
      if (trade.speedupAvailable && !phoneCallRequestSent) {
        yield call(__confirmPhoneCall, trade)
      }
      yield put(
        actions.form.change('buySellTabStatus', 'status', 'order_history')
      )
      yield put(modalActions.showModal('SfoxTradeDetails', { trade }))
    } catch (e) {
      yield put(A.sfoxFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'submitQuote', e))
    }
  }

  const prepareAddress = function*() {
    try {
      const state = yield select()
      const defaultIdx = selectors.core.wallet.getDefaultAccountIndex(state)
      const receiveR = selectors.core.common.btc.getNextAvailableReceiveAddress(
        networks.btc,
        defaultIdx,
        state
      )
      const receiveIdxR = selectors.core.common.btc.getNextAvailableReceiveIndex(
        networks.btc,
        defaultIdx,
        state
      )
      return {
        address: receiveR.getOrElse(),
        index: receiveIdxR.getOrElse(),
        accountIndex: defaultIdx
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'prepareAddress', e))
    }
  }

  const submitSellQuote = function*(action) {
    const q = action.payload
    try {
      const password = yield call(promptForSecondPassword)
      yield put(A.sfoxLoading())
      const trade = yield call(coreSagas.data.sfox.handleSellTrade, q)

      const state = yield select()

      let p = path(['sfoxSignup', 'payment'], state)
      let payment = yield coreSagas.payment.btc.create({
        payment: p.getOrElse({}),
        network: networks.btc
      })

      payment = yield payment.amount(parseInt(trade.sendAmount))

      // QA Tool: manually set a "to" address on the payment object for testing sell
      const qaAddress = path(['qa', 'qaSellAddress'], state)
      if (qaAddress) {
        payment = yield payment.to(qaAddress)
      } else {
        payment = yield payment.to(trade.receiveAddress)
      }

      payment = yield payment.description(`${sellDescription}${trade.id}`)

      try {
        payment = yield payment.build()
      } catch (e) {
        throw new Error('could not build payment')
      }

      payment = yield payment.sign(password)
      payment = yield payment.publish()

      yield put(actions.core.data.bitcoin.fetchData())
      yield put(
        actions.core.wallet.setTransactionNote(
          payment.value().txId,
          payment.value().description
        )
      )

      yield put(A.sfoxSuccess())
      yield put(
        actions.form.change('buySellTabStatus', 'status', 'order_history')
      )
      yield put(modalActions.showModal('SfoxTradeDetails', { trade }))
      yield put(A.initializePayment())
    } catch (e) {
      yield put(A.sfoxFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'submitSellQuote', e))
    }
  }

  const checkProfileStatus = function*() {
    const profile = yield select(selectors.core.data.sfox.getProfile)
    const modals = yield select(modalSelectors.getModals)
    if (
      Remote.Failure.is(profile) &&
      equals('SfoxExchangeData', prop('type', head(modals)))
    ) {
      yield call(coreSagas.data.sfox.refetchProfile)
    } else {
      yield call(fetchJumioStatus)
    }
  }

  const initializePayment = function*() {
    try {
      yield put(A.sfoxSellBtcPaymentUpdatedLoading())
      let payment = coreSagas.payment.btc.create({
        network: networks.btc
      })
      payment = yield payment.init()
      const defaultIndex = yield select(
        selectors.core.wallet.getDefaultAccountIndex
      )
      const defaultFeePerByte = path(['fees', 'priority'], payment.value())
      payment = yield payment.from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
      payment = yield payment.fee(defaultFeePerByte)
      yield put(A.sfoxSellBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sfoxSellBtcPaymentUpdatedFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'initializePayment', e)
      )
    }
  }

  const __confirmPhoneCall = function*(trade) {
    const smsNumberR = yield select(selectors.core.settings.getSmsNumber)
    const smsNumber = smsNumberR.getOrElse(null)
    try {
      const confirmed = yield call(confirm, {
        title: CC.PHONE_CALL_TITLE,
        message: CC.PHONE_CALL_MSG,
        confirm: CC.CONFIRM_PHONE_CALL,
        cancel: CC.CANCEL_PHONE_CALL,
        messageValues: { smsNumber }
      })
      if (confirmed) {
        yield put(actions.core.kvStore.buySell.sfoxSetPhoneCall(true))
        const profileR = yield select(selectors.core.data.sfox.getProfile)
        const profile = profileR.getOrElse({})
        yield apply(profile, profile.submitPhoneCallOptIn, [trade])
      }
    } catch (e) {
      actions.logs.logErrorMessage(logLocation, 'confirmPhoneCall', e)
    }
  }

  const initializeJumio = function*() {
    try {
      const status = yield call(fetchJumioStatus)
      const accountsR = yield select(selectors.core.data.sfox.getAccounts)
      const accounts = accountsR.getOrElse([])
      // If user has not set up jumio and they have bank accounts
      if (!status && accounts.length) {
        const confirmed = yield call(confirm, {
          title: CC.VERIFY_IDENTITY_TITLE,
          image: 'identity-verification',
          message: CC.VERIFY_IDENTITY_MSG,
          confirm: CC.CONFIRM_VERIFY_IDENTITY,
          cancel: CC.CANCEL_VERIFY_IDENTITY
        })
        if (confirmed) {
          yield put(
            modalActions.showModal('SfoxExchangeData', { step: 'jumio' })
          )
        }
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initializeJumio', e))
    }
  }

  const completeJumio = function*() {
    try {
      // Jumio status of 'PENDING' can mean the user finished verification
      // flow and the results are 'PENDING' jumio. Or the user has not finished
      // and the flow requires user action.
      // When a Jumio callback has been retreived, set jumio token to 'complete'
      // so the UI can determine which type of 'PENDING' status the user is.
      const tokenR = yield select(selectors.core.kvStore.buySell.getSfoxJumio)
      const accountsR = yield select(selectors.core.data.sfox.getAccounts)
      const accounts = accountsR.getOrElse([])
      let token = tokenR.getOrFail(missingJumioToken)
      token.completed = true
      accounts.length
        ? yield put(modalActions.closeAllModals())
        : yield put(A.nextStep('funding'))
      yield call(fetchJumioStatus)
      yield put(actions.core.kvStore.buySell.sfoxSetJumioToken(token))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'completeJumio', e))
    }
  }

  const fetchJumioStatus = function*() {
    try {
      yield put(A.fetchJumioStatusLoading())
      const profileR = yield select(selectors.core.data.sfox.getProfile)
      const tokenR = yield select(selectors.core.kvStore.buySell.getSfoxJumio)
      const token = tokenR.getOrFail()
      const profile = profileR.getOrElse({})
      if (!token) {
        throw new Error(missingJumioToken)
      } else {
        const status = yield apply(profile, profile.fetchJumioStatus, [
          token.id
        ])
        const success = yield put(A.fetchJumioStatusSuccess(status))
        return prop('payload', success)
      }
    } catch (e) {
      yield put(A.fetchJumioStatusFailure(e))
    }
  }

  const fetchJumioToken = function*() {
    try {
      yield put(A.fetchJumioTokenLoading())
      const profileR = yield select(selectors.core.data.sfox.getProfile)
      const profile = profileR.getOrElse({})
      let token = yield apply(profile, profile.fetchJumioToken)
      // If a new token must be fetched set 'completed' to false
      token.completed = false
      yield put(actions.core.kvStore.buySell.sfoxSetJumioToken(token))
      yield put(A.fetchJumioTokenSuccess(token))
      yield call(fetchJumioStatus)
    } catch (e) {
      yield put(A.fetchJumioTokenFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchJumioToken', e))
    }
  }

  const sfoxInitialize = function*() {
    try {
      yield put(actions.core.data.sfox.fetchTrades())
      yield put(actions.core.data.sfox.fetchProfile())
      yield put(actions.core.data.sfox.sfoxFetchAccounts())
      yield put(
        actions.core.data.sfox.fetchQuote({
          quote: { amt: 1e8, baseCurrency: 'BTC', quoteCurrency: 'USD' }
        })
      )
      yield put(
        actions.core.data.sfox.fetchSellQuote({
          quote: { amt: 1e8, baseCurrency: 'BTC', quoteCurrency: 'USD' }
        })
      )
      yield put(A.initializePayment())
      yield put(A.sfoxNotAsked())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'sfoxInitialize', e))
    }
  }

  return {
    checkProfileStatus,
    __confirmPhoneCall,
    initializePayment,
    prepareAddress,
    setBankManually,
    setBank,
    sfoxInitialize,
    sfoxSignup,
    setProfile,
    submitMicroDeposits,
    submitQuote,
    submitSellQuote,
    initializeJumio,
    fetchJumioToken,
    fetchJumioStatus,
    completeJumio,
    upload
  }
}
