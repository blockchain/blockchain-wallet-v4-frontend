import { select } from 'redux-saga/effects'
import {
  promptForSecondPassword,
  askSecondPasswordEnhancer
} from 'services/SagaService'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as actions from '../../actions'
import * as settingsActions from './actions.js'
import * as selectors from '../../selectors.js'
import settingsSagas, { logLocation, recoverySaga } from './sagas'
import * as C from 'services/AlertService'
import { merge } from 'ramda'
// import profileSagas from 'data/modules/profile/sagaRegister'
// import { syncUserWithWallet } from 'data/modules/profile/sagas'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
// jest.mock('data/modules/profile/sagas')
jest.mock()
const coreSagas = coreSagasFactory()

const SECRET_GOOGLE_AUTHENTICATOR_URL = 'some_url'

// syncUserWithWallet.mockImplementation(() => true)
// profileSagas.syncUserWithWallet = jest.fn()

describe('settingsSagas', () => {
  beforeAll(() => {
    Math.random = () => 0.5
  })

  describe('initSettingsInfo', () => {
    let { initSettingsInfo } = settingsSagas({ coreSagas })

    let saga = testSaga(initSettingsInfo)

    it('should call fetchSettings', () => {
      saga.next().call(coreSagas.settings.fetchSettings)
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'initSettingsInfo', error))
      })
    })
  })

  describe('initSettingsPreferences', () => {
    let { initSettingsPreferences } = settingsSagas({ coreSagas })

    let saga = testSaga(initSettingsPreferences)

    it('should call fetchSettings', () => {
      saga.next().call(coreSagas.settings.fetchSettings)
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'initSettingsPreferences', error))
      })
    })
  })

  describe('showGoogleAuthenticatorSecretUrl', () => {
    let { showGoogleAuthenticatorSecretUrl } = settingsSagas({ coreSagas })

    let saga = testSaga(showGoogleAuthenticatorSecretUrl)

    it('should call the core to request the secret url', () => {
      saga.next().call(coreSagas.settings.requestGoogleAuthenticatorSecretUrl)
    })

    it('should show the two step google auth modal', () => {
      saga.next(SECRET_GOOGLE_AUTHENTICATOR_URL)
        .put(actions.modals.showModal('TwoStepGoogleAuthenticator', {
          googleAuthenticatorSecretUrl: SECRET_GOOGLE_AUTHENTICATOR_URL
        }))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'showGoogleAuthenticatorSecretUrl', error))
      })
    })
  })

  describe('updateMobile', () => {
    let { updateMobile } = settingsSagas({ coreSagas })

    let action = { payload: '5555555555' }

    let saga = testSaga(updateMobile, action)

    it('should call setMobile in the core', () => {
      saga.next().call(coreSagas.settings.setMobile, action.payload)
    })

    it('should select userFlowSupported', () => {
      saga.next().select(selectors.modules.profile.userFlowSupported)
    })

    // it('should call syncUserWithWallet', () => {
    //   saga.next(Remote.of(true)).call(syncUserWithWallet)
    // })

    // it('should display success', () => {
    //   saga.next().next().put(actions.alerts.displaySuccess(C.MOBILE_UPDATE_SUCCESS))
    // })
  })

  describe('resendMobile', () => {
    let { resendMobile } = settingsSagas({ coreSagas })

    let action = { payload: '5555555555' }

    let saga = testSaga(resendMobile, action)

    it('should call setMobile in the core', () => {
      saga.next().call(coreSagas.settings.setMobile, action.payload)
    })

    it('should display success alert', () => {
      saga.next().put(actions.alerts.displaySuccess(C.SMS_RESEND_SUCCESS))
    })
  })

  describe('verifyMobile', () => {
    let { verifyMobile } = settingsSagas({ coreSagas })

    let action = { payload: '5555555555' }

    let saga = testSaga(verifyMobile, action)

    it('should call setMobileVerified', () => {
      saga.next().call(coreSagas.settings.setMobileVerified, action.payload)
    })

    it('should select the modal stack', () => {
      let response = 'updated successfully'
      saga.next(response).select(selectors.modals.getModals)
    })

    it('should close all modals if not SfoxExchangeData modal', () => {
      let modals = [ { type: 'modal_type' } ]
      saga.next(modals).put(actions.modals.closeAllModals())
    })

    it('should select userFlowSupported', () => {
      saga.next().select(selectors.modules.profile.userFlowSupported)
    })

    it('should display success', () => {
      saga.next(Remote.of(false)).put(actions.alerts.displaySuccess(C.MOBILE_VERIFY_SUCCESS))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'verifyMobile', error))
          .next()
          .put(actions.alerts.displayError(C.MOBILE_VERIFY_ERROR))
          .next()
          .put(actions.modules.settings.verifyMobileFailure())
      })
    })
  })
})
