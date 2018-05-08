import { put, call, select } from 'redux-saga/effects'
import * as A from './actions'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
import * as modalActions from '../../modals/actions'
import * as sendBtcActions from '../../components/sendBtc/actions'
import * as sendBtcSelectors from '../../components/sendBtc/selectors'
import settings from 'config'
import { Remote } from 'blockchain-wallet-v4/src'
import { promptForSecondPassword } from 'services/SagaService'

export default ({ coreSagas }) => {
  const logLocation = 'modules/sfox/sagas'

  const setBankManually = function * (action) {
    try {
      yield call(coreSagas.data.sfox.setBankManually, action.payload)
      yield put(actions.alerts.displaySuccess('Bank has been added!'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'setBankManually', e))
    }
  }

  const sfoxSignup = function * () {
    try {
      yield call(coreSagas.data.sfox.signup)
      const profile = yield select(selectors.core.data.sfox.getProfile)
      if (!profile.error) {
        yield put(A.nextStep('verify'))
      } else {
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
      yield put(actions.alerts.displayError('Failed to upload document.'))
    }
  }

  const setBank = function * (payload) {
    try {
      yield call(coreSagas.data.sfox.setBankAccount, payload)
      yield put(actions.alerts.displaySuccess('Bank account set successfully!'))
      yield put(modalActions.closeAllModals())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'setBank', e))
    }
  }

  const submitMicroDeposits = function * (payload) {
    try {
      yield call(coreSagas.data.sfox.verifyMicroDeposits, payload)
      yield put(actions.alerts.displaySuccess('Bank Verified!'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'submitMicroDeposits', e))
    }
  }

  const submitQuote = function * (action) {
    try {
      yield put(A.orderLoading())
      yield call(coreSagas.data.sfox.handleTrade, action.payload)
      yield put(A.orderSuccess())
      yield put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
    } catch (e) {
      yield put(A.sfoxFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'submitQuote', e))
    }
  }

  const submitSellQuote = function * (action) {
    const q = action.payload
    try {
      yield put(A.orderLoading())
      const trade = yield call(coreSagas.data.sfox.handleSellTrade, q)

      // TODO can refactor this to use payment.chain in the future for cleanliness
      let p = yield select(sendBtcSelectors.getPayment)
      let payment = yield coreSagas.payment.btc.create({ payment: p.getOrElse({}), network: settings.NETWORK_BITCOIN })

      payment = yield payment.amount(parseInt(trade.sendAmount))
      payment = yield payment.fee('priority')
      payment = yield payment.to(trade.receiveAddress)
      payment = yield payment.description(`Exchange Trade SFX-${trade.id}`)

      try {
        payment = yield payment.build()
      } catch (e) {
        yield put(actions.logs.logErrorMessage(logLocation, 'submitSellQuote', e))
      }
      yield put(sendBtcActions.sendBtcPaymentUpdated(Remote.of(payment.value())))

      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()

      yield put(sendBtcActions.sendBtcPaymentUpdated(Remote.of(payment.value())))
      yield put(A.orderSuccess())
      yield put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
    } catch (e) {
      yield put(A.sfoxFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'submitSellQuote', e))
    }
  }

  return {
    setBankManually,
    setBank,
    sfoxSignup,
    setProfile,
    upload,
    submitMicroDeposits,
    submitQuote,
    submitSellQuote
  }
}
