import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { head, last, path } from 'ramda'

import { actions } from 'data'
import { MODAL_NAME as IV_MODAL } from 'data/components/identityVerification/model'
import { KYC_STATES } from 'data/modules/profile/model'
import modalsReducer from 'data/modals/reducers'
import profileReducer from 'data/modules/profile/reducers'
import { eeaCountryCodes } from 'services/IdentityVerificationService'
import {
  getInvited,
  getCountryCode
} from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { getCanTrade } from 'data/exchange/selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import KYCBanner from 'components/IdentityVerification/KYCBanner'

import ProfileContainer, { Profile } from './index'
import IdentityVerification from './IdentityVerification'
import { Route, Switch } from 'react-router-dom'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.mock('data/exchange/selectors')
jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')
getCanTrade.mockImplementation(() => Remote.of(true))
getInvited.mockImplementation(() => Remote.of({ kyc: true }))
getCountryCode.mockImplementation(() => head(eeaCountryCodes))

const BuySellStub = () => <div />
const ExchangeStub = () => <div />

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
      <TestBed withRouter={true} store={store}>
        <Switch>
          <Route exact path='/' component={ProfileContainer} />
          <Route path='/buy-sell' component={BuySellStub} />
          <Route path='/exchange' component={ExchangeStub} />
        </Switch>
      </TestBed>
    )
  })

  describe('user flow not supported', () => {
    it('should render null when not invited', () => {
      getInvited.mockImplementationOnce(() => Remote.of({ kyc: false }))
      wrapper.unmount()
      wrapper.mount()
      expect(wrapper.find(Profile).children().length).toBe(0)
    })

    // it('should render null when not country is not supported', () => {
    //   getCountryCode.mockImplementationOnce(() => '')
    //   wrapper.unmount()
    //   wrapper.mount()
    //   expect(wrapper.find(Profile).children().length).toBe(0)
    // })
  })

  describe('default state', () => {
    it('should have KYC_STATE: NONE by default', () => {
      expect(wrapper.find(Profile).prop('kycState')).toBe(KYC_STATES.NONE)
    })
  })

  describe('banner', () => {
    it('should render KYCBanner', () => {
      expect(wrapper.find(KYCBanner)).toHaveLength(1)
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

    describe('KYC_STATE: VERIFIED', () => {
      beforeEach(() => {
        store.dispatch(
          actions.modules.profile.setUserData({ kycState: KYC_STATES.VERIFIED })
        )
        wrapper.update()
      })

      it('should lead to buysell is user can trade', () => {
        wrapper
          .find(IdentityVerification)
          .find('button')
          .simulate('click', { button: 0 })
        expect(wrapper.find(BuySellStub)).toHaveLength(1)
      })

      it('should lead to exchange if user can not trade', () => {
        getCanTrade.mockImplementationOnce(() => Remote.of(false))
        wrapper.unmount().mount()
        wrapper
          .find(IdentityVerification)
          .find('button')
          .simulate('click', { button: 0 })
        expect(wrapper.find(ExchangeStub)).toHaveLength(1)
      })
    })
  })
})
