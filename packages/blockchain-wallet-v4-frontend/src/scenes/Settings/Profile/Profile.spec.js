import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { last, path } from 'ramda'

import { MODAL_NAME as IV_MODAL } from 'data/components/identityVerification/model'
import { KYC_STATES } from 'data/modules/profile/model'
import modalsReducer from 'data/modals/reducers'
import profileReducer from 'data/modules/profile/reducers'

import ProfileContainer, { Profile } from './index'
import IdentityVerification from './IdentityVerification'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

describe('Profile Settings', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer,
    modals: modalsReducer,
    profile: profileReducer
  }
  const sagas = []
  let store
  let wrapper
  beforeEach(() => {
    store = createTestStore(reducers, sagas)
    wrapper = mount(
      <TestBed store={store}>
        <ProfileContainer />
      </TestBed>
    )
  })

  describe('default state', () => {
    it('should have KYC_STATE: NONE by default', () => {
      expect(wrapper.find(Profile).prop('kycState')).toBe(KYC_STATES.NONE)
    })
  })

  describe('Identity Verfication setting', () => {
    describe('KYC_STATE: NONE', () => {
      it('should trigger IdentityVerification modal action on button click', () => {
        wrapper
          .find(IdentityVerification)
          .find('button')
          .simulate('click')

        const lastAction = last(dispatchSpy.mock.calls)[0]
        expect(path(['type'], lastAction)).toBe('SHOW_MODAL')
        expect(path(['payload', 'type'], lastAction)).toBe(IV_MODAL)
      })
    })
  })
})
