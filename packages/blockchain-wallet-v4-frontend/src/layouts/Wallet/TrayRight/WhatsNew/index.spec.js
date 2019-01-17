import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { combineReducers } from 'redux'
import { Remote } from 'blockchain-wallet-v4/src'
import EmptyContent from 'services/WhatsNewService/WhatsNewContent/EmptyContent'
import layoutWalletReducer from 'data/components/layoutWallet/reducers'
import WhatsNew, { Wrapper } from './index'
import { getLastViewed } from 'blockchain-wallet-v4/src/redux/kvStore/whatsNew/selectors'
import { getCountryCode } from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { getUserKYCState } from 'data/modules/profile/selectors'
import { KYC_STATES } from 'data/modules/profile/model'
const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

jest.mock('blockchain-wallet-v4/src/redux/kvStore/whatsNew/selectors')
jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')
jest.mock('data/modules/profile/selectors')

getUserKYCState.mockImplementation(() => Remote.of(KYC_STATES.NONE))
getCountryCode.mockImplementation(() => Remote.of('US'))

describe('WhatsNew', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer,
    components: combineReducers({
      layoutWallet: layoutWalletReducer
    })
  }
  const sagas = []
  let store
  let wrapper
  beforeEach(() => {
    store = createTestStore(reducers, sagas)
    wrapper = mount(
      <TestBed withRouter={true} store={store}>
        <WhatsNew />
      </TestBed>
    )
  })

  describe('WhatsNew empty state', () => {
    getLastViewed.mockImplementation(() => Remote.of(1600142400000))
    beforeEach(() => {
      getLastViewed.mockImplementation(() => Remote.of(1600142400000))
    })
    it('should render with the empty content template', () => {
      wrapper.unmount().mount()
      wrapper.update()
      expect(wrapper.find(Wrapper)).toHaveLength(1)
      expect(wrapper.find(EmptyContent)).toHaveLength(1)
    })
  })

  describe('WhatsNew non empty state', () => {
    getLastViewed.mockImplementation(() => Remote.of(1505448000000))
    beforeEach(() => {
      getLastViewed.mockImplementation(() => Remote.of(1505448000000))
    })
    it('should not render with the empty template', () => {
      wrapper.unmount().mount()
      wrapper.update()
      expect(wrapper.find(Wrapper)).toHaveLength(1)
      expect(wrapper.find(EmptyContent)).toHaveLength(0)
    })
  })
})
