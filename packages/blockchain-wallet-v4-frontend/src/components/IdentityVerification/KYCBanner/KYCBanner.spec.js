import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { init, last, path } from 'ramda'

import { actions, actionTypes } from 'data'
import {
  KYC_MODAL,
  USER_EXISTS_MODAL
} from 'data/components/identityVerification/model'
import { KYC_STATES, USER_ACTIVATION_STATES } from 'data/modules/profile/model'
import identityVerificationSaga from 'data/components/identityVerification/sagaRegister'
import { getUserId } from 'blockchain-wallet-v4/src/redux/kvStore/userCredentials/selectors'
import { Remote } from 'blockchain-wallet-v4'
import modalsReducer from 'data/modals/reducers'
import profileReducer from 'data/modules/profile/reducers'

import { Route, Switch } from 'react-router-dom'
import Banner, { KYCBanner } from './index'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.mock('blockchain-wallet-v4/src/redux/wallet/selectors')
jest.mock('blockchain-wallet-v4/src/redux/kvStore/userCredentials/selectors')

const IndexPageStub = () => <div />
const ExchangeStub = () => <div />
const ProfileStub = () => <div />
const coreSagas = {}
const api = {
  generateRetailToken: jest.fn(() => ({})),
  checkUserExistence: jest.fn()
}

describe('Profile Settings', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer,
    modals: modalsReducer,
    profile: profileReducer
  }
  const sagas = [identityVerificationSaga({ api, coreSagas })]
  let store
  let wrapper

  describe('Inside of profile', () => {
    beforeEach(() => {
      store = createTestStore(reducers, sagas)
      wrapper = mount(
        <TestBed withRouter={true} store={store}>
          <Switch>
            <Route exact path='/' children={() => <Banner />} />
            <Route path='/swap' component={ExchangeStub} />
          </Switch>
        </TestBed>
      )
    })

    describe('default state', () => {
      it('should not render by default', () => {
        expect(wrapper.find(KYCBanner).isEmptyRender()).toBe(true)
      })
    })

    describe('KYC_STATE: NONE', () => {
      beforeEach(() => {
        store.dispatch(
          actions.modules.profile.fetchUserDataSuccess({
            state: USER_ACTIVATION_STATES.NONE,
            kycState: KYC_STATES.NONE
          })
        )
        wrapper.unmount().mount()
      })

      it('should trigger log kyc event on button click', () => {
        wrapper.find('button').simulate('click')

        const lastAction = last(init(dispatchSpy.mock.calls))[0]
        expect(path(['type'], lastAction)).toBe(
          actionTypes.analytics.LOG_KYC_EVENT
        )
      })

      it('should trigger verifyIdentity action on button click', () => {
        wrapper.find('button').simulate('click')

        const lastAction = last(init(init(dispatchSpy.mock.calls)))[0]
        expect(path(['type'], lastAction)).toBe(
          actionTypes.components.identityVerification.VERIFY_IDENTITY
        )
      })

      it('should show KYC modal on button click when user is already created', () => {
        getUserId.mockReturnValue(Remote.of('userId'))
        wrapper.find('button').simulate('click')

        const lastAction = last(dispatchSpy.mock.calls)[0]
        expect(path(['type'], lastAction)).toBe('SHOW_MODAL')
        expect(path(['payload', 'type'], lastAction)).toBe(KYC_MODAL)
      })

      it('should show KYC modal on button click when checkUser returns error', async () => {
        getUserId.mockReturnValue(Remote.of(''))
        api.checkUserExistence.mockRejectedValue({})
        await wrapper.find('button').simulate('click')

        const lastAction = last(dispatchSpy.mock.calls)[0]
        expect(path(['type'], lastAction)).toBe('SHOW_MODAL')
        expect(path(['payload', 'type'], lastAction)).toBe(KYC_MODAL)
      })

      it('should show USER_EXISTS modal on button click when checkUser returns success', async () => {
        getUserId.mockReturnValue(Remote.of(''))
        api.checkUserExistence.mockResolvedValue('')
        await wrapper.find('button').simulate('click')

        const lastAction = last(init(dispatchSpy.mock.calls))[0]
        expect(path(['type'], lastAction)).toBe('SHOW_MODAL')
        expect(path(['payload', 'type'], lastAction)).toBe(USER_EXISTS_MODAL)
      })
    })

    describe('KYC_STATE: PENDING', () => {
      beforeEach(() => {
        store.dispatch(
          actions.modules.profile.fetchUserDataSuccess({
            state: USER_ACTIVATION_STATES.CREATED,
            kycState: KYC_STATES.PENDING
          })
        )
        wrapper.unmount().mount()
      })

      it('should show not show button outside of profile', () => {
        expect(wrapper.find('button')).toHaveLength(0)
      })
    })

    describe('KYC_STATE: VERIFIED', () => {
      beforeEach(() => {
        store.dispatch(
          actions.modules.profile.fetchUserDataSuccess({
            state: USER_ACTIVATION_STATES.ACTIVE,
            kycState: KYC_STATES.VERIFIED
          })
        )
        wrapper.update()
      })

      it('should lead to exchange', () => {
        wrapper.find('button').simulate('click', { button: 0 })
        expect(wrapper.find(ExchangeStub)).toHaveLength(1)
      })
    })

    describe('USER_ACTIVATION_STATES: NONE', () => {
      beforeEach(() => {
        store.dispatch(
          actions.modules.profile.fetchUserDataSuccess({
            state: USER_ACTIVATION_STATES.NONE,
            kycState: KYC_STATES.NONE
          })
        )
        wrapper.unmount().mount()
      })

      it('should have the userState of NONE', () => {
        expect(wrapper.find(KYCBanner).prop('userState')).toBe(
          USER_ACTIVATION_STATES.NONE
        )
      })
    })
  })

  describe('Outside of profile', () => {
    beforeEach(() => {
      store = createTestStore(reducers, sagas)
      wrapper = mount(
        <TestBed withRouter={true} store={store}>
          <Switch>
            <Route
              exact
              path='/'
              children={() => <Banner outsideOfProfile={true} />}
            />
            <Route exact path='/' component={IndexPageStub} />
            <Route path='/settings/profile' component={ProfileStub} />
          </Switch>
        </TestBed>
      )
    })

    describe('KYC_STATE: PENDING', () => {
      beforeEach(() => {
        store.dispatch(
          actions.modules.profile.fetchUserDataSuccess({
            state: USER_ACTIVATION_STATES.CREATED,
            kycState: KYC_STATES.PENDING
          })
        )
        wrapper.update()
      })

      it('should show button outside of profile', () => {
        expect(wrapper.find('button')).toHaveLength(1)
      })

      it('should lead to /settings/profile on click', () => {
        wrapper.find('button').simulate('click', { button: 0 })
        expect(wrapper.find(ProfileStub)).toHaveLength(1)
      })
    })

    describe('KYC_STATE: VERIFIED', () => {
      beforeEach(() => {
        store.dispatch(
          actions.modules.profile.fetchUserDataSuccess({
            kycState: KYC_STATES.VERIFIED
          })
        )
        wrapper.unmount().mount()
      })

      it('should show not show banner outside of profile', () => {
        expect(wrapper.find(KYCBanner).children()).toHaveLength(0)
      })
    })

    describe('USER_ACTIVATION_STATES: NONE', () => {
      beforeEach(() => {
        store.dispatch(
          actions.modules.profile.fetchUserDataSuccess({
            state: USER_ACTIVATION_STATES.NONE,
            kycState: KYC_STATES.NONE
          })
        )
        wrapper.unmount().mount()
      })

      it('should have the userState of NONE', () => {
        expect(wrapper.find(KYCBanner).prop('userState')).toBe(
          USER_ACTIVATION_STATES.NONE
        )
      })
    })
  })
})
