import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { combineReducers } from 'redux'
import { last } from 'ramda'

import { actions, actionTypes } from 'data'
import { MODAL_NAME } from 'data/components/identityVerification/model'
import { coreReducers, paths, coreSagasFactory } from 'blockchain-wallet-v4/src'
import identityVerificationReducer from 'data/components/identityVerification/reducers'
import modalsReducer from 'data/modals/reducers'
import identityVerificationSaga from 'data/components/identityVerification/sagaRegister'

import IdentityVerification from './index'
import Personal from './Personal'
import PersonalTemplate from './Personal/template'
import EditEmail from './Personal/EditEmail'
import EditSmsNumber from './Personal/EditSmsNumber'
import Tray from 'components/Tray'
import { ModalHeader } from 'blockchain-info-components'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory({ api: {} })
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
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
    [paths.settingsPath]: coreReducers.settings
  }
  const sagas = [identityVerificationSaga({ coreSagas, api })]
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
      wrapper.update()
    })

    it('should show email entry field by deafult', () => {
      expect(wrapper.find(Personal)).toHaveLength(1)
      expect(wrapper.find(EditEmail)).toHaveLength(1)
      expect(wrapper.find('Field[name="email"]')).toHaveLength(1)
    })

    it('should show email code field if email is not verified', () => {
      store.dispatch(actions.core.settings.fetchSettingsSuccess({}))
      store.dispatch(actions.core.settings.setEmail(stubMail))
      wrapper.update()
      expect(wrapper.find(EditEmail)).toHaveLength(1)
      expect(wrapper.find('Field[name="email"]')).toHaveLength(0)
      expect(wrapper.find('Field[name="code"]')).toHaveLength(1)
    })

    it('should show sms code field if email is verified and smsNumber is not set', async () => {
      store.dispatch(actions.core.settings.fetchSettingsSuccess({}))
      store.dispatch(actions.core.settings.setEmail(stubMail))
      store.dispatch(actions.core.settings.setEmailVerified())
      wrapper.update()
      expect(wrapper.find(EditSmsNumber)).toHaveLength(1)
      expect(wrapper.find('Field[name="smsNumber"]')).toHaveLength(1)
    })

    it('should show sms code field if email is verified and sms is not verified', () => {
      store.dispatch(actions.core.settings.fetchSettingsSuccess({}))
      store.dispatch(actions.core.settings.setEmail(stubMail))
      store.dispatch(actions.core.settings.setEmailVerified())
      store.dispatch(actions.core.settings.setMobile(stubMobile))
      wrapper.update()
      expect(wrapper.find(EditSmsNumber)).toHaveLength(1)
      expect(wrapper.find('Field[name="smsNumber"]')).toHaveLength(0)
      expect(wrapper.find('Field[name="code"]')).toHaveLength(1)
    })

    it('should show personal form if both email and sms are verified', () => {
      store.dispatch(actions.core.settings.fetchSettingsSuccess({}))
      store.dispatch(actions.core.settings.setEmail(stubMail))
      store.dispatch(actions.core.settings.setEmailVerified())
      store.dispatch(actions.core.settings.setMobile(stubMobile))
      store.dispatch(actions.core.settings.setMobileVerified())
      wrapper.update()
      expect(wrapper.find(PersonalTemplate)).toHaveLength(1)
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

      it('should navigate to email edit form on edit email button click', () => {
        wrapper
          .find('Field[name="email"]')
          .closest('template__VerifiedContainer')
          .find('template__EditLink')
          .prop('onClick')()
        wrapper.update()
        expect(wrapper.find(EditEmail)).toHaveLength(1)
        expect(wrapper.find('Field[name="email"]')).toHaveLength(1)
      })

      it('should show current email after navigation', () => {
        wrapper
          .find('Field[name="email"]')
          .closest('template__VerifiedContainer')
          .find('template__EditLink')
          .prop('onClick')()
        wrapper.update()
        expect(
          wrapper
            .find('Field[name="email"]')
            .find('input')
            .prop('value')
        ).toBe(stubMail)
      })

      it('should navigate to sms number edit form on edit mobile button click', () => {
        wrapper
          .find('Field[name="smsNumber"]')
          .closest('template__VerifiedContainer')
          .find('template__EditLink')
          .prop('onClick')()
        wrapper.update()
        expect(wrapper.find(EditSmsNumber)).toHaveLength(1)
        expect(wrapper.find('Field[name="smsNumber"]')).toHaveLength(1)
      })

      it('should show current number after navigation', () => {
        wrapper
          .find('Field[name="smsNumber"]')
          .closest('template__VerifiedContainer')
          .find('template__EditLink')
          .prop('onClick')()
        wrapper.update()
        expect(
          wrapper.find('Field[name="smsNumber"]').prop('defaultValue')
        ).toBe(stubMobile)
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
          .find('input')
          .simulate('change', { target: { value: '11/11/1999' } })
        wrapper
          .find('Field[name="lastName"]')
          .find('input')
          .simulate('change', { target: { value: 'Beloved' } })
        wrapper
          .find('Field[name="firstName"]')
          .find('input')
          .simulate('change', { target: { value: 'User' } })
        wrapper.update()
        expect(wrapper.find('Button[type="submit"]').prop('disabled')).toBe(
          false
        )
      })

      it('should validate age to be over 18', () => {
        wrapper
          .find('Field[name="dob"]')
          .find('input')
          .simulate('change', {
            target: { value: `11/11/${new Date().getFullYear() - 17}` }
          })
        wrapper
          .find('Field[name="lastName"]')
          .find('input')
          .simulate('change', { target: { value: 'Beloved' } })
        wrapper
          .find('Field[name="firstName"]')
          .find('input')
          .simulate('change', { target: { value: 'User' } })
        wrapper.update()
        expect(wrapper.find('Button[type="submit"]').prop('disabled')).toBe(
          true
        )
      })
    })
  })
})
