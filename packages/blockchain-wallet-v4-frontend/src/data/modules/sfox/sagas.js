import { delay } from 'redux-saga'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as A from './actions'
import { actions } from 'data'
import * as selectors from '../../selectors.js'
import * as MODALS_ACTIONS from '../../modals/actions'

export default ({ coreSagas }) => {
  const setBankManually = function * (action) {
    try {
      yield call(coreSagas.data.sfox.setBankManually, action.payload)
      yield put(actions.alerts.displaySuccess('Bank has been added!'))
    } catch (e) {
      console.warn(e)
      yield put(actions.alerts.displayError('Could not add bank. Please try again.'))
      // can dispatch an action here to set some kind of state
    }
  }

  const sfoxSignup = function * () {
    try {
      yield call(coreSagas.data.sfox.signup)
      const profile = yield select(selectors.core.data.sfox.getProfile)

      if (!profile.error) {
        yield put(A.nextStep('verify'))
        yield put(actions.alerts.displaySuccess('Account successfully created!'))
      } else {
        yield put(A.signupFailure(profile.error))
      }
    } catch (e) {
      yield put(actions.alerts.displayError('Error creating account'))
    }
  }

  const setProfile = function * (payload) {
    try {
      yield call(coreSagas.data.sfox.setProfile, payload)

      const profile = yield select(selectors.core.data.sfox.getProfile)
      if (profile.error) {
        throw new Error(profile.error)
      } else {
        yield put(actions.alerts.displaySuccess('Profile submitted successfully for verification!'))
        yield put(A.nextStep('funding'))
      }
    } catch (e) {
      yield put(A.setVerifyError(e))
      yield put(actions.alerts.displayError(`Error verifying profile: ${e}`))
    }
  }

  const upload = function * (payload) {
    try {
      yield call(coreSagas.data.sfox.uploadDoc, payload)

      const profile = yield select(selectors.core.data.sfox.getProfile)
      if (profile.data._verification_status.required_docs.length) {
        yield put(actions.alerts.displaySuccess('Document uploaded successfully!'))
      } else {
        yield put(actions.alerts.displaySuccess('Document uploaded successfully!'))
        yield put(A.nextStep('link'))
      }
    } catch (e) {
      yield put(actions.alerts.displayError('Error uploading'))
    }
  }

  const setBank = function * (payload) {
    try {
      yield call(coreSagas.data.sfox.setBankAccount, payload)
      yield put(actions.alerts.displaySuccess('Bank account set successfully!'))
      yield put(MODALS_ACTIONS.closeAllModals())
    } catch (e) {
      yield put(actions.alerts.displayError('Error setting bank'))
    }
  }

  const submitMicroDeposits = function * (payload) {
    try {
      yield call(coreSagas.data.sfox.verifyMicroDeposits, payload)
      yield put(actions.alerts.displaySuccess('Bank Verified!'))
    } catch (e) {
      yield put(actions.alerts.displayError('Unable to verify bank'))
    }
  }

  const submitQuote = function * (action) {
    console.log('submitting quote:', action.payload)
    yield call(delay, 1500)
    yield put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
  }

  return function * () {
    yield takeLatest(AT.SET_BANK_MANUALLY, setBankManually)
    yield takeLatest(AT.SET_BANK, setBank)
    yield takeLatest(AT.SFOX_SIGNUP, sfoxSignup)
    yield takeLatest(AT.SET_PROFILE, setProfile)
    yield takeLatest(AT.UPLOAD, upload)
    yield takeLatest(AT.SUBMIT_MICRO_DEPOSITS, submitMicroDeposits)
    yield takeLatest(AT.SUBMIT_QUOTE, submitQuote)
  }
}
