import { actions, model } from 'data'
import { combineReducers } from 'redux'
import { createTestStore, getDispatchSpyReducer, TestBed } from 'utils/testbed'
import { flushPromises } from 'utils/test.utils'
import { mount } from 'enzyme'
import React from 'react'

import * as actionTypes from 'data/actionTypes'
import {
  coreReducers,
  coreSagasFactory,
  paths,
  Remote
} from 'blockchain-wallet-v4/src'
import { find, head, last, pathEq } from 'ramda'
import { getCoinifyBusy } from 'data/components/coinify/selectors'
import {
  getCountry,
  getProfile
} from 'blockchain-wallet-v4/src/redux/data/coinify/selectors'
import {
  getCountryCode,
  getEmail,
  getEmailVerified,
  getSmsNumber,
  getSmsVerified
} from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { getGuid } from 'blockchain-wallet-v4/src/redux/wallet/selectors'
import {
  getLifetimeToken,
  getUserId
} from 'blockchain-wallet-v4/src/redux/kvStore/userCredentials/selectors'
import {
  getStates,
  getSteps,
  getSupportedCountries,
  getVerificationStep
} from 'data/components/identityVerification/selectors'
import { KYC_STATES, USER_ACTIVATION_STATES } from 'data/modules/profile/model'
import { ModalHeader } from 'blockchain-info-components'
import { TermsText } from 'components/BuySell/Coinify/Create/AcceptTerms/template'
import IdentityVerification from './index'
import identityVerificationReducer from 'data/components/identityVerification/reducers'
import identityVerificationSaga from 'data/components/identityVerification/sagaRegister'
import modalsReducer from 'data/modals/reducers'
import profileReducer from 'data/modules/profile/reducers'
import profileSagas from 'data/modules/profile/sagaRegister'
import securityCenterSagas from 'data/modules/securityCenter/sagaRegister'
import settingsSagas from 'data/modules/settings/sagaRegister'
import Tray from 'components/Tray'

const { KYC_MODAL, STEPS } = model.components.identityVerification

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

jest.mock('blockchain-wallet-v4/src/redux/sagas')
jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')
jest.mock('blockchain-wallet-v4/src/redux/kvStore/userCredentials/selectors')
jest.mock('blockchain-wallet-v4/src/redux/wallet/selectors')
jest.mock('data/components/identityVerification/selectors')
jest.mock('data/components/coinify/selectors')
jest.mock('blockchain-wallet-v4/src/redux/data/coinify/selectors')

const POSSIBLE_ADDRESSES = [
  {
    line1: 'Square Louvois',
    line2: '',
    postCode: '75002',
    city: '',
    state: 'Île-de-France'
  },
  {
    line1: 'Rue Montmartre, 108',
    line2: '',
    postCode: '75002',
    city: '',
    state: 'Île-de-France'
  }
]
const STUB_COUNTRY_CODE = 'FR'
const SUPPORTED_COUNTRIES = [{ code: STUB_COUNTRY_CODE, name: 'France' }]

const stubMail = 'mail@mail.com'
const STUB_MOBILE = '212555555'

const coreSagas = coreSagasFactory({ api: {} })
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn(),
  getSupportedCountries: () =>
    Remote.of([{ name: 'France', code: 'FR' }, { name: 'Spain', code: 'ES' }]),
  getStates: () => Remote.of([]),
  fetchKycAddresses: () => Remote.of(POSSIBLE_ADDRESSES)
}

getUserId.mockImplementation(() => Remote.of(123))
getLifetimeToken.mockImplementation(() => Remote.of(456))
getSmsVerified.mockImplementation(() => Remote.of(0))
getSmsNumber.mockImplementation(() => Remote.of(''))
getEmail.mockImplementation(() => Remote.of(stubMail))
getEmailVerified.mockImplementation(() => Remote.of(1))
getGuid.mockImplementation(() => Remote.of('123-abc-456-def'))
getCountryCode.mockImplementation(() => Remote.of('FR'))
getSupportedCountries.mockImplementation(() =>
  Remote.Success(SUPPORTED_COUNTRIES)
)
getStates.mockImplementation(() => Remote.Success([]))
getCountry.mockImplementation(() => Remote.of('FR'))
getProfile.mockImplementation(() => Remote.of({ _country: 'FR' }))
getSteps.mockReturnValue(Remote.of(['personal', 'mobile', 'verify']))
getCoinifyBusy.mockImplementation(() => Remote.Success({}))

profileSagas.createUser = jest.fn()

describe('IdentityVerification Modal', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer,
    modals: modalsReducer,
    components: combineReducers({
      identityVerification: identityVerificationReducer
    }),
    profile: profileReducer,
    [paths.settingsPath]: coreReducers.settings
  }
  const sagas = [
    identityVerificationSaga({ coreSagas, api }),
    securityCenterSagas({ coreSagas }),
    settingsSagas({ coreSagas }),
    profileSagas({ coreSagas, api })
  ]
  let store
  let wrapper
  beforeEach(() => {
    store = createTestStore(reducers, sagas)
    wrapper = mount(
      <TestBed store={store}>
        <IdentityVerification />
      </TestBed>
    )
  })

  describe('Modal behaviour', () => {
    it('should render after modal action', () => {
      expect(wrapper.find(Tray)).toHaveLength(0)

      store.dispatch(actions.modals.showModal(KYC_MODAL))
      wrapper.update()

      expect(wrapper.find(Tray)).toHaveLength(1)
    })

    it('should be hidden on close click', () => {
      store.dispatch(actions.modals.showModal(KYC_MODAL))
      wrapper.update()
      wrapper.find(ModalHeader).prop('onClose')()
      wrapper.update()
      expect(wrapper.find(Tray).prop('in')).toBe(false)
    })
  })

  describe('form behaviour', () => {
    getVerificationStep.mockImplementation(() => STEPS.personal)
    beforeEach(() => {
      store.dispatch(actions.modals.showModal(KYC_MODAL))
      coreSagas.settings.sendConfirmationCodeEmail.mockClear()
      coreSagas.settings.setMobile.mockClear()
      wrapper.update()
    })

    describe('personal form', () => {
      beforeEach(() => {
        store.dispatch(
          actions.modules.profile.fetchUserDataSuccess({
            state: USER_ACTIVATION_STATES.NONE,
            kycState: KYC_STATES.NONE
          })
        )
        store.dispatch(actions.core.settings.fetchSettingsSuccess({}))
        store.dispatch(actions.core.settings.setEmail(stubMail))
        store.dispatch(actions.core.settings.setEmailVerified())
        store.dispatch(actions.core.settings.setMobile(STUB_MOBILE))
        store.dispatch(actions.core.settings.setMobileVerified())
        wrapper.update()
      })

      it('should be disabled and not submit by default', () => {
        expect(wrapper.find('Button[type="submit"]').prop('disabled')).toBe(
          true
        )
        wrapper.find('form').simulate('submit')
        expect(last(dispatchSpy.mock.calls)[0].type).toEqual(
          actionTypes.form.SET_SUBMIT_FAILED
        )
      })

      it('should enable continue if all fields are filled', async () => {
        wrapper
          .find('Field[name="dob"]')
          .find('input[name="date"]')
          .simulate('change', {
            target: { value: `11` }
          })
        wrapper
          .find('Field[name="dob"]')
          .find('SelectBox')
          .prop('input')
          .onChange('11')
        wrapper
          .find('Field[name="dob"]')
          .find('input[name="year"]')
          .simulate('change', {
            target: { value: '1999' }
          })
        wrapper
          .find('Field[name="lastName"]')
          .find('input')
          .simulate('change', { target: { value: 'Beloved' } })
        wrapper
          .find('Field[name="firstName"]')
          .find('input')
          .simulate('change', { target: { value: 'User' } })
        wrapper
          .find('Field[name="country"]')
          .find('SelectBox')
          .prop('input')
          .onChange({ code: 'FR' })
        wrapper.unmount().mount()
        wrapper
          .find('Field[name="postCode"]')
          .find('input[name="postCode"]')
          .simulate('change', {
            target: { value: '75002' }
          })
        wrapper.unmount().mount()
        wrapper
          .find('Field[name="line1"]')
          .find('input[name="line1"]')
          .simulate('change', {
            target: { value: POSSIBLE_ADDRESSES[0]['line1'] }
          })
        wrapper
          .find('Field[name="city"]')
          .find('input[name="city"]')
          .simulate('change', {
            target: { value: 'Paris' }
          })
        await jest.runAllTimers()
        await flushPromises()
        wrapper.update()

        expect(wrapper.find('Button[type="submit"]').prop('disabled')).toBe(
          false
        )
      })

      it('should validate age to be over 18', () => {
        wrapper
          .find('Field[name="dob"]')
          .find('input[name="date"]')
          .simulate('change', {
            target: { value: `11` }
          })
        wrapper
          .find('Field[name="dob"]')
          .find('SelectInputContainer')
          .prop('onChange')('11')
        wrapper
          .find('Field[name="dob"]')
          .find('input[name="year"]')
          .simulate('change', {
            target: { value: '2005' }
          })
        wrapper
          .find('Field[name="lastName"]')
          .find('input')
          .simulate('change', { target: { value: 'Beloved' } })
        wrapper
          .find('Field[name="firstName"]')
          .find('input')
          .simulate('change', { target: { value: 'User' } })
        jest.runAllTimers()
        wrapper.update()
        expect(wrapper.find('Button[type="submit"]').prop('disabled')).toBe(
          true
        )
      })
    })
  })

  describe('coinify signup step - verified email', () => {
    beforeEach(() => {
      getVerificationStep.mockImplementation(() => STEPS.coinify)
      store.dispatch(actions.modals.showModal(KYC_MODAL, { isCoinify: true }))
      coreSagas.settings.sendConfirmationCodeEmail.mockClear()
      getEmailVerified.mockImplementation(() => Remote.of(1))
      wrapper.update()
    })

    it('should have the submit button enabled when email is verified', async () => {
      wrapper.unmount().mount()
      expect(wrapper.find(TermsText)).toHaveLength(1)
      expect(wrapper.find('button').props().disabled).toBe(false)
    })

    it('should move to the personal step when continue is clicked', async () => {
      wrapper.find('button').simulate('click')

      let calls = dispatchSpy.mock.calls
      let findSetVerificationStepAction = find(
        pathEq(
          [0, 'type'],
          actionTypes.components.identityVerification.SET_VERIFICATION_STEP
        )
      )
      expect(head(findSetVerificationStepAction(calls)).payload).toEqual({
        step: STEPS.personal
      })
    })
  })
})
