import { put, call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as A from './actions'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
import * as modalActions from '../../modals/actions'
import * as modalSelectors from '../../modals/selectors'
import settings from 'config'
import * as C from 'services/AlertService'
import { promptForSecondPassword } from 'services/SagaService'
import { path, prop, equals, head } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

export const sellDescription = `Exchange Trade SFX-`
export const logLocation = 'modules/sfox/sagas'

export default ({ coreSagas }) => {
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
        yield put(A.nextStep('funding'))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'upload', e))
      yield put(actions.alerts.displayError(C.DOCUMENT_UPLOAD_ERROR))
    }
  }

  const setBank = function*(payload) {
    try {
      yield call(coreSagas.data.sfox.setBankAccount, payload)
      yield put(actions.alerts.displaySuccess(C.BANK_ACCOUNT_SET_SUCCESS))
      yield put(modalActions.closeAllModals())
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
        settings.NETWORK_BITCOIN,
        defaultIdx,
        state
      )
      const receiveIdxR = selectors.core.common.btc.getNextAvailableReceiveIndex(
        settings.NETWORK_BITCOIN,
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
        network: settings.NETWORK_BITCOIN
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

  const checkForProfileFailure = function*() {
    const profile = yield select(selectors.core.data.sfox.getProfile)
    const modals = yield select(modalSelectors.getModals)
    if (
      Remote.Failure.is(profile) &&
      equals('SfoxExchangeData', prop('type', head(modals)))
    ) {
      yield call(coreSagas.data.sfox.refetchProfile)
    }
  }

  const initializePayment = function*() {
    try {
      yield put(A.sfoxSellBtcPaymentUpdatedLoading())
      let payment = coreSagas.payment.btc.create({
        network: settings.NETWORK_BITCOIN
      })
      payment = yield payment.init()
      const defaultIndex = yield select(
        selectors.core.wallet.getDefaultAccountIndex
      )
      const defaultFeePerByte = path(['fees', 'priority'], payment.value())
      payment = yield payment.from(defaultIndex)
      payment = yield payment.fee(defaultFeePerByte)
      yield put(A.sfoxSellBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sfoxSellBtcPaymentUpdatedFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'initializePayment', e)
      )
    }
  }

  return {
    checkForProfileFailure,
    initializePayment,
    prepareAddress,
    setBankManually,
    setBank,
    sfoxSignup,
    setProfile,
    submitMicroDeposits,
    submitQuote,
    submitSellQuote,
    upload
  }
}
