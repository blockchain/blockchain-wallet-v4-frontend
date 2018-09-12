import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { flushPromises } from 'utils/test.utils'
import { mount } from 'enzyme'
import { combineReducers } from 'redux'
import { actions, model } from 'data'

import { coreReducers, paths, coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import identityVerificationReducer from 'data/components/identityVerification/reducers'
import { getPossibleAddresses, getSupportedCountries } from 'data/components/identityVerification/selectors'
import modalsReducer from 'data/modals/reducers'
import profileReducer from 'data/modules/profile/reducers'
import identityVerificationSaga from 'data/components/identityVerification/sagaRegister'
import securityCenterSagas from 'data/modules/securityCenter/sagaRegister'
import settingsSagas from 'data/modules/settings/sagaRegister'
import profileSagas from 'data/modules/profile/sagaRegister'
import * as actionTypes from 'data/actionTypes'
import IdentityVerification from './index'
import Tray from 'components/Tray'
import { ModalHeader } from 'blockchain-info-components'
import { last } from 'ramda'
import {
  getUserId,
  getLifetimeToken
} from 'blockchain-wallet-v4/src/redux/kvStore/userCredentials/selectors'
import { getEmail, getSmsVerified, getCountryCode } from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { getGuid } from 'blockchain-wallet-v4/src/redux/wallet/selectors'

const { MODAL_NAME } = model.components.identityVerification

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

jest.mock('blockchain-wallet-v4/src/redux/sagas')
jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')
jest.mock('blockchain-wallet-v4/src/redux/kvStore/userCredentials/selectors')
jest.mock('blockchain-wallet-v4/src/redux/wallet/selectors')
jest.mock('data/components/identityVerification/selectors')

const POSSIBLE_ADDRESSES = [
  { line1: 'Square Louvois', line2: '', postCode: '75002', city: '', state: 'Île-de-France' },
  { line1: 'Rue Montmartre, 108', line2: '', postCode: '75002', city: '', state: 'Île-de-France' }
]
const SUPPORTED_COUNTRIES = [{ code: 'FR', name: 'France' }]

const coreSagas = coreSagasFactory({ api: {} })
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn(),
  getSupportedCountries: () => Remote.of([{ name: 'France' }, { name: 'Spain' }]),
  fetchKycAddresses: () => Remote.of(POSSIBLE_ADDRESSES)
}

getUserId.mockImplementation(() => Remote.of(123))
getLifetimeToken.mockImplementation(() => Remote.of(456))
getSmsVerified.mockImplementation(() => Remote.of(0))
getEmail.mockImplementation(() => Remote.of('email@email.com'))
getGuid.mockImplementation(() => Remote.of('123-abc-456-def'))
getCountryCode.mockImplementation(() => Remote.of('FR'))
getPossibleAddresses.mockImplementation(() => POSSIBLE_ADDRESSES)
getSupportedCountries.mockImplementation(() => Remote.Success(SUPPORTED_COUNTRIES))

profileSagas.createUser = jest.fn()
// mock entire createUser saga
// profilesagas.createuser = jest.fn()

const stubMail = 'mail@mail.com'
const stubMobile = '+1 123 1234567'

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

      store.dispatch(actions.modals.showModal(MODAL_NAME))
      wrapper.update()

      expect(wrapper.find(Tray)).toHaveLength(1)
    })

    it('should be hidden on close click', () => {
      store.dispatch(actions.modals.showModal(MODAL_NAME))
      wrapper.update()
      wrapper.find(ModalHeader).prop('onClose')()
      wrapper.update()
      expect(wrapper.find(Tray).prop('in')).toBe(false)
    })
  })

  describe('form behaviour', () => {
    beforeEach(() => {
      store.dispatch(actions.modals.showModal(MODAL_NAME))
      coreSagas.settings.sendConfirmationCodeEmail.mockClear()
      coreSagas.settings.setMobile.mockClear()
      wrapper.update()
    })

    describe('personal form', () => {
      beforeEach(() => {
        store.dispatch(actions.core.settings.fetchSettingsSuccess({}))
        store.dispatch(actions.core.settings.setEmail(stubMail))
        store.dispatch(actions.core.settings.setEmailVerified())
        store.dispatch(actions.core.settings.setMobile(stubMobile))
        store.dispatch(actions.core.settings.setMobileVerified())     
        wrapper.update()
      })

      it('should be disabled and not submit by default', () => {
        expect(wrapper.find('Button[type="submit"]').prop('disabled')).toBe(
          true
        )
        wrapper.find('template__PersonalForm').simulate('submit')
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
          .find('Field[name="address"]')
          .find('SelectBox')
          .prop('input')
          .onChange(POSSIBLE_ADDRESSES[0])
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
        wrapper
          .find('Field[name="state"]')
          .find('input[name="state"]')
          .simulate('change', {
            target: { value: POSSIBLE_ADDRESSES[0]['state'] }
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
})
