import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { init, last } from 'ramda'

import { actions, actionTypes } from 'data'
import profileReducer from 'data/modules/profile/reducers'

import { ConnectedSwapUpgrade as SwapUpgrade } from './SwapUpgrade'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

const userLimits = [
  {
    annual: '199',
    daily: null,
    currency: 'USD',
    index: 1
  }
]
const tiers = [
  {
    index: 1,
    limits: {
      annual: '1000',
      daily: null,
      currency: 'USD',
      index: 1
    }
  },
  {
    index: 2,
    limits: {
      annual: null,
      daily: '25000',
      currency: 'USD',
      index: 1
    }
  }
]

const currentTier = 1
const nextTier = 2
describe('Swap Upgrade', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer,
    profile: profileReducer
  }
  const sagas = []
  const createStore = (userLimits, tiers) => {
    const store = createTestStore(reducers, sagas)
    store.dispatch(
      actions.modules.profile.fetchUserDataSuccess({
        limits: userLimits
      })
    )
    store.dispatch(actions.modules.profile.fetchTiersSuccess(tiers))
    return store
  }
  const render = store =>
    mount(
      <TestBed store={store}>
        <SwapUpgrade nextTier={nextTier} currentTier={currentTier} />
      </TestBed>
    )

  it('should render next tier limit and remaining limit for current tier', () => {
    const store = createStore(userLimits, tiers)
    const wrapper = render(store)

    expect(
      wrapper.text().indexOf('You have $199.00 left to Swap')
    ).toBeGreaterThan(-1)
    expect(
      wrapper
        .text()
        .indexOf('Upgrade to Tier 2 and Swap up to $25,000.00 every day.')
    ).toBeGreaterThan(-1)
  })

  it('should send HIDE_SWAP_UPGRADE_MODAL action on mount', () => {
    const store = createStore(userLimits, tiers)
    render(store)

    expect(last(dispatchSpy.mock.calls)[0].type).toEqual(
      actionTypes.preferences.HIDE_SWAP_UPGRADE_MODAL
    )
  })

  it('should send CLOSE_MODAL and VERIFY_IDENTITY action on mount', () => {
    const store = createStore(userLimits, tiers)
    const wrapper = render(store)

    wrapper.find('button').simulate('click')

    expect(last(init(dispatchSpy.mock.calls))[0].type).toEqual(
      actionTypes.modals.CLOSE_MODAL
    )
    expect(last(dispatchSpy.mock.calls)[0].type).toEqual(
      actionTypes.components.identityVerification.VERIFY_IDENTITY
    )
    expect(last(dispatchSpy.mock.calls)[0].payload.tier).toEqual(nextTier)
  })
})
