import * as C from 'services/AlertService'
import * as matchers from 'redux-saga-test-plan/matchers'
import { actions, selectors } from 'data'
import { contains } from 'ramda'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { promptForSecondPassword } from 'services/SagaService'
import { select } from 'redux-saga/effects'
import settingsSagas, {
  ipRestrictionError,
  logLocation,
  taskToPromise
} from './sagas'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()

const SECRET_GOOGLE_AUTHENTICATOR_URL = 'some_url'
const MOCK_PASSWORD = 'password'
const MOCK_GUID = '50dae286-e42e-4d67-8419-d5dcc563746c'

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
          .put(
            actions.logs.logErrorMessage(logLocation, 'initSettingsInfo', error)
          )
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
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'initSettingsPreferences',
              error
            )
          )
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
      saga.next(SECRET_GOOGLE_AUTHENTICATOR_URL).put(
        actions.modals.showModal('TwoStepGoogleAuthenticator', {
          googleAuthenticatorSecretUrl: SECRET_GOOGLE_AUTHENTICATOR_URL
        })
      )
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'showGoogleAuthenticatorSecretUrl',
              error
            )
          )
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

    it('should select userFlowSupported', () => {
      saga.next().select(selectors.modules.profile.userFlowSupported)
    })

    it('should display success', () => {
      saga
        .next(Remote.of(false))
        .put(actions.alerts.displaySuccess(C.MOBILE_VERIFY_SUCCESS))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error, show an error alert, and dispatch a verify mobile error action', () => {
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

  describe('updateLanguage', () => {
    let { updateLanguage } = settingsSagas({ coreSagas })

    let action = { payload: { language: 'ES' } }

    let saga = testSaga(updateLanguage, action)

    it('should call setLanguage', () => {
      saga.next().call(coreSagas.settings.setLanguage, action.payload)
    })

    it('should add the language to the url', () => {
      saga.next()
      expect(contains(action.payload.language, window.location.href)).toBe(true)
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'updateLanguage', error)
          )
      })
    })
  })

  describe('updateCurrency', () => {
    let { updateCurrency } = settingsSagas({ coreSagas })

    let action = { payload: 'USD' }

    let saga = testSaga(updateCurrency, action)

    it('should call setCurrency', () => {
      saga.next().call(coreSagas.settings.setCurrency, action.payload)
    })

    it('should display a success alert', () => {
      saga.next()
      saga.next().put(actions.alerts.displaySuccess(C.CURRENCY_UPDATE_SUCCESS))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error and show an error alert', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'updateCurrency', error)
          )
          .next()
          .put(actions.alerts.displayError(C.CURRENCY_UPDATE_ERROR))
      })
    })
  })

  describe('updateAutoLogout', () => {
    let { updateAutoLogout } = settingsSagas({ coreSagas })

    let action = { payload: 100 }

    let saga = testSaga(updateAutoLogout, action)

    it('should call set auto logout', () => {
      saga.next().call(coreSagas.settings.setAutoLogout, action.payload)
    })

    it('should put an action to start logout timer', () => {
      saga.next().put(actions.auth.startLogoutTimer())
    })

    it('should display success', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.AUTOLOGOUT_UPDATE_SUCCESS))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error and dispatch an action to show an error alert', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'updateAutoLogout', error)
          )
          .next()
          .put(actions.alerts.displayError(C.AUTOLOGOUT_UPDATE_ERROR))
      })
    })
  })

  describe('updateLoggingLevel', () => {
    let { updateLoggingLevel } = settingsSagas({ coreSagas })

    let action = { payload: 'logging_level' }

    let saga = testSaga(updateLoggingLevel, action)

    it('should call set logging level', () => {
      saga.next().call(coreSagas.settings.setLoggingLevel, action.payload)
    })

    it('should display success', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.LOGGINGLEVEL_UPDATE_SUCCESS))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error and display an error alert', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'updateLoggingLevel',
              error
            )
          )
          .next()
          .put(actions.alerts.displayError(C.LOGGINGLEVEL_UPDATE_ERROR))
      })
    })
  })

  describe('updateIpLock', () => {
    let { updateIpLock } = settingsSagas({ coreSagas })

    let action = { payload: 'ip_lock' }

    let saga = testSaga(updateIpLock, action)

    it('should call set ip lock', () => {
      saga.next().call(coreSagas.settings.setIpLock, action.payload)
    })

    it('should display success', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.IPWHITELIST_UPDATE_SUCCESS))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error and display an error alert', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'updateIpLock', error))
          .next()
          .put(actions.alerts.displayError(C.IPWHITELIST_UPDATE_ERROR))
      })
    })
  })

  describe('updateIpLockOn', () => {
    let { updateIpLockOn } = settingsSagas({ coreSagas })

    let action = { payload: 'ip_lock_on' }

    let saga = testSaga(updateIpLockOn, action)

    it('should call set ip lock on', () => {
      saga.next().call(coreSagas.settings.setIpLockOn, action.payload)
    })

    it('should display success', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.IPRESTRICTION_UPDATE_SUCCESS))
    })

    describe('error handling not ipRestriction error', () => {
      const error = new Error('ERROR')
      it('should log the error and display the correct error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'updateIpLockOn', error)
          )
          .next()
          .put(actions.alerts.displayError(C.IPRESTRICTION_UPDATE_ERROR))
      })
    })

    describe('error handling ipRestriction error', () => {
      const error = ipRestrictionError
      it('should log the error and display the correct error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'updateIpLockOn', error)
          )
          .next()
          .put(actions.alerts.displayError(C.IPRESTRICTION_NO_WHITELIST_ERROR))
      })
    })
  })

  describe('updateBlockTorIps', () => {
    let { updateBlockTorIps } = settingsSagas({ coreSagas })

    let action = { payload: 'block_tor' }

    let saga = testSaga(updateBlockTorIps, action)

    it('should call set block tor ips', () => {
      saga.next().call(coreSagas.settings.setBlockTorIps, action.payload)
    })

    it('should display success', () => {
      saga.next().put(actions.alerts.displaySuccess(C.TOR_UPDATE_SUCCESS))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error and display an error alert', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'updateBlockTorIps',
              error
            )
          )
          .next()
          .put(actions.alerts.displayError(C.TOR_UPDATE_ERROR))
      })
    })
  })

  describe('updateHint', () => {
    let { updateHint } = settingsSagas({ coreSagas })

    let action = { payload: 'hint' }

    let saga = testSaga(updateHint, action)

    it('should call set hint', () => {
      saga.next().call(coreSagas.settings.setHint, action.payload)
    })

    it('should display success', () => {
      saga.next().put(actions.alerts.displaySuccess(C.HINT_UPDATE_SUCCESS))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error and display an error alert', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'updateHint', error))
          .next()
          .put(actions.alerts.displayError(C.HINT_UPDATE_ERROR))
      })
    })
  })

  describe('updateTwoStepRemember', () => {
    let { updateTwoStepRemember } = settingsSagas({ coreSagas })

    describe('with authTypeNeverSave 1', () => {
      let action = { payload: { authTypeNeverSave: 1 } }

      let saga = testSaga(updateTwoStepRemember, action)

      it('should call the core', () => {
        saga
          .next()
          .call(coreSagas.settings.setAuthTypeNeverSave, action.payload)
      })

      it('should select the guid', () => {
        saga.next().select(selectors.core.wallet.getGuid)
      })

      it('should put removeSession with the guid', () => {
        saga.next(MOCK_GUID).put(actions.session.removeSession(MOCK_GUID))
      })

      it('should display a success alert', () => {
        saga
          .next()
          .put(actions.alerts.displaySuccess(C.TWOFA_REMEMBER_UPDATE_SUCCESS))
      })
    })

    describe('without authTypeNeverSave of 1', () => {
      let action = { payload: { authTypeNeverSave: 0 } }

      let saga = testSaga(updateTwoStepRemember, action)

      it('should call the core', () => {
        saga
          .next()
          .call(coreSagas.settings.setAuthTypeNeverSave, action.payload)
      })
      it('should display a success alert', () => {
        saga
          .next()
          .put(actions.alerts.displaySuccess(C.TWOFA_REMEMBER_UPDATE_SUCCESS))
      })

      describe('error handling', () => {
        const error = new Error('ERROR')
        it('should log the error and display an error alert', () => {
          saga
            .restart()
            .next()
            .throw(error)
            .put(
              actions.logs.logErrorMessage(
                logLocation,
                'updateTwoStepRemember',
                error
              )
            )
            .next()
            .put(actions.alerts.displayError(C.TWOFA_REMEMBER_UPDATE_ERROR))
        })
      })
    })
  })

  describe('enableTwoStepMobile', () => {
    let { enableTwoStepMobile } = settingsSagas({ coreSagas })

    let action = { payload: 'two_step_mobile' }

    let saga = testSaga(enableTwoStepMobile, action)

    it('should call core set authType', () => {
      saga.next().call(coreSagas.settings.setAuthType, action.payload)
    })

    it('should display success', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.TWOFA_MOBILE_ENABLE_SUCCESS))
    })

    it('should close the modal', () => {
      saga.next().put(actions.modals.closeModal())
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error and display an error alert', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'enableTwoStepMobile',
              error
            )
          )
          .next()
          .put(actions.alerts.displayError(C.TWOFA_MOBILE_ENABLE_ERROR))
      })
    })
  })

  describe('enableTwoStepGoogleAuthenticator', () => {
    let { enableTwoStepGoogleAuthenticator } = settingsSagas({ coreSagas })

    let action = { payload: 'google_auth' }

    let saga = testSaga(enableTwoStepGoogleAuthenticator, action)

    it('should call core set google auth', () => {
      saga
        .next()
        .call(coreSagas.settings.setGoogleAuthenticator, action.payload)
    })

    it('should display success', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.TWOFA_GOOGLEAUTH_ENABLE_SUCCESS))
    })

    it('should close the modal', () => {
      saga.next().put(actions.modals.closeModal())
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error and display an error alert', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'enableTwoStepGoogleAuthenticator',
              error
            )
          )
          .next()
          .put(actions.alerts.displayError(C.TWOFA_GOOGLEAUTH_ENABLE_ERROR))
      })
    })
  })

  describe('enableTwoStepYubikey', () => {
    let { enableTwoStepYubikey } = settingsSagas({ coreSagas })

    let action = { payload: 'yubikey' }

    let saga = testSaga(enableTwoStepYubikey, action)

    it('should call core set setYubikey', () => {
      saga.next().call(coreSagas.settings.setYubikey, action.payload)
    })

    it('should display success', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.TWOFA_YUBIKEY_ENABLE_SUCCESS))
    })

    it('should close the modal', () => {
      saga.next().put(actions.modals.closeModal())
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error and display an error alert', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'enableTwoStepYubikey',
              error
            )
          )
          .next()
          .put(actions.alerts.displayError(C.TWOFA_YUBIKEY_ENABLE_ERROR))
      })
    })
  })

  describe('showBtcPrivateKey', () => {
    const { showBtcPrivateKey } = settingsSagas({ coreSagas })

    let action = { payload: { addr: 'address' } }

    let saga = testSaga(showBtcPrivateKey, action)

    it('should call promptForSecondPassword', () => {
      saga.next().call(promptForSecondPassword)
    })

    it('should select the wallet', () => {
      saga.next(MOCK_PASSWORD).select(selectors.core.wallet.getWallet)
    })
  })

  describe('showEthPrivateKey', () => {
    const getMnemonic = () => jest.fn()
    const { showEthPrivateKey } = settingsSagas({ coreSagas })

    let action = { payload: { isLegacy: false } }

    it('should get the mnemonic', () => {
      expectSaga(showEthPrivateKey, action)
        .provide([
          [matchers.call.fn(promptForSecondPassword), 'password'],
          [select(getMnemonic), 'mnemonicT'],
          [matchers.call.fn(() => taskToPromise), 'mnemonic']
        ])
        .run()
    })
  })
})
