import { put, call, select } from 'redux-saga/effects'
import * as A from './actions'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
import * as modalActions from '../../modals/actions'
import * as sendBtcActions from '../../components/sendBtc/actions'
import * as sendBtcSelectors from '../../components/sendBtc/selectors'
import settings from 'config'
import { Remote } from 'blockchain-wallet-v4/src'
import * as C from 'services/AlertService'
import { promptForSecondPassword } from 'services/SagaService'
import { path } from 'ramda'

export default ({ coreSagas }) => {
  const logLocation = 'modules/sfox/sagas'

  const setBankManually = function * (action) {
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

  const sfoxSignup = function * () {
    try {
      yield put(A.sfoxLoading())
      yield call(coreSagas.data.sfox.signup)
      const profile = yield select(selectors.core.data.sfox.getProfile)
      if (!profile.error) {
        yield put(A.sfoxSuccess())
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

  const setProfile = function * (payload) {
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

  const upload = function * (payload) {
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

  const setBank = function * (payload) {
    try {
      yield call(coreSagas.data.sfox.setBankAccount, payload)
      yield put(actions.alerts.displaySuccess(C.BANK_ACCOUNT_SET_SUCCESS))
      yield put(modalActions.closeAllModals())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'setBank', e))
    }
  }

  const submitMicroDeposits = function * (payload) {
    try {
      yield put(A.sfoxLoading())
      const result = yield call(coreSagas.data.sfox.verifyMicroDeposits, payload)
      if (result.status === 'active') {
        yield put(A.sfoxSuccess())
        yield put(modalActions.closeAllModals())
      } else {
        yield put(A.sfoxNotAsked())
        throw new Error(result)
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'submitMicroDeposits', e))
      yield put(A.sfoxFailure(e))
    }
  }

  const submitQuote = function * (action) {
    try {
      yield put(A.sfoxLoading())
      const nextAddressData = yield call(prepareAddress)
      const trade = yield call(coreSagas.data.sfox.handleTrade, action.payload, nextAddressData)
      yield put(A.sfoxSuccess())
      yield put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
      yield put(modalActions.showModal('SfoxTradeDetails', { trade }))
    } catch (e) {
      yield put(A.sfoxFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'submitQuote', e))
    }
  }

  const prepareAddress = function * () {
    try {
      const state = yield select()
      const defaultIdx = selectors.core.wallet.getDefaultAccountIndex(state)
      const receiveR = selectors.core.common.btc.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, defaultIdx, state)
      const receiveIdxR = selectors.core.common.btc.getNextAvailableReceiveIndex(settings.NETWORK_BITCOIN, defaultIdx, state)
      return {
        address: receiveR.getOrElse(),
        index: receiveIdxR.getOrElse(),
        accountIndex: defaultIdx
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'prepareAddress', e))
    }
  }

  const submitSellQuote = function * (action) {
    const q = action.payload
    try {
      yield put(A.sfoxLoading())
      const trade = yield call(coreSagas.data.sfox.handleSellTrade, q)

      let p = yield select(sendBtcSelectors.getPayment)
      let payment = yield coreSagas.payment.btc.create({ payment: p.getOrElse({}), network: settings.NETWORK_BITCOIN })

      payment = yield payment.amount(parseInt(trade.sendAmount))

      // QA Tool: manually set a "to" address on the payment object for testing sell
      const qaState = yield select()
      const qaAddress = path(['qa', 'qaSellAddress'], qaState)

      if (qaAddress) {
        payment = yield payment.to(qaAddress)
      } else {
        payment = yield payment.to(trade.receiveAddress)
      }

      payment = yield payment.description(`Exchange Trade SFX-${trade.id}`)

      try {
        payment = yield payment.build()
      } catch (e) {
        yield put(actions.logs.logErrorMessage(logLocation, 'submitSellQuote', e))
      }

      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()

      yield put(sendBtcActions.sendBtcPaymentUpdated(Remote.of(payment.value())))
      yield put(A.sfoxSuccess())
      yield put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
    } catch (e) {
      yield put(A.sfoxFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'submitSellQuote', e))
    }
  }

  return {
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
