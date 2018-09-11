import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { combineReducers } from 'redux'
import { actions, model } from 'data'

import { coreReducers, paths, coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import identityVerificationReducer from 'data/components/identityVerification/reducers'
import modalsReducer from 'data/modals/reducers'
import profileReducer from 'data/modules/profile/reducers'
import identityVerificationSaga from 'data/components/identityVerification/sagaRegister'
import securityCenterSagas from 'data/modules/securityCenter/sagaRegister'
import settingsSagas from 'data/modules/settings/sagaRegister'
import * as actionTypes from 'data/actionTypes'
import IdentityVerification from './index'
import Tray from 'components/Tray'
import { ModalHeader } from 'blockchain-info-components'
import { last } from 'ramda'

const { MODAL_NAME } = model.components.identityVerification

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory({ api: {} })
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn(),
  getSupportedCountries: () => Remote.of([{ name: 'France' }, { name: 'Spain' }])
}

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
    settingsSagas({ coreSagas })
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

      it('should enable continue if all fields are filled', () => {
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

        jest.runAllTimers()
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
