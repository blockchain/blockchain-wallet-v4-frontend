import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'

import { actions, model } from 'data'
import profileReducer from 'data/modules/profile/reducers'

import LimitInfo from './index'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

const { TIERS_STATES } = model.profile

describe('Profile Settings', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer,
    profile: profileReducer
  }
  const sagas = []
  const createStore = (userTiers, userLimits, tiers) => {
    const store = createTestStore(reducers, sagas)
    store.dispatch(
      actions.modules.profile.fetchUserDataSuccess({
        tiers: userTiers,
        limits: userLimits
      })
    )
    store.dispatch(actions.modules.profile.fetchTiersSuccess(tiers))
    return store
  }
  const render = store =>
    mount(
      <TestBed withRouter store={store}>
        <LimitInfo />
      </TestBed>
    )

  describe('Rendering', () => {
    it('should render nothing if last attempted Tier is 0', () => {
      const userTiers = {
        current: null,
        selected: null,
        next: null
      }
      const userLimits = []
      const tiers = [
        {
          index: 1,
          state: TIERS_STATES.NONE
        },
        {
          index: 2,
          state: TIERS_STATES.NONE
        }
      ]
      const store = createStore(userTiers, userLimits, tiers)
      const wrapper = render(store)

      expect(wrapper.html()).toBeNull()
    })

    it('should render nothing if last attempted Tier 1 and Tier 2 are REJECTED', () => {
      const userTiers = {
        current: 0,
        selected: 2,
        next: 2
      }
      const userLimits = []
      const tiers = [
        {
          index: 1,
          state: TIERS_STATES.REJECTED
        },
        {
          index: 2,
          state: TIERS_STATES.REJECTED
        }
      ]
      const store = createStore(userTiers, userLimits, tiers)
      const wrapper = render(store)

      expect(wrapper.html()).toBeNull()
    })

    it('should render "Tier 1 - In Review" if Tier 1 is PENDING and next is 1', () => {
      const userTiers = {
        current: 0,
        selected: 1,
        next: 1
      }
      const userLimits = []
      const tiers = [
        {
          index: 1,
          state: TIERS_STATES.PENDING
        },
        {
          index: 2,
          state: TIERS_STATES.NONE
        }
      ]
      const store = createStore(userTiers, userLimits, tiers)
      const wrapper = render(store)

      expect(wrapper.text().trim()).toBe('Tier 1 -  In Review')
    })

    it('should render "Tier 1 - In Review" and "Upgrade" if Tier 1 is PENDING and next is 2', () => {
      const userTiers = {
        current: 0,
        selected: 1,
        next: 2
      }
      const userLimits = []
      const tiers = [
        {
          index: 1,
          state: TIERS_STATES.PENDING
        },
        {
          index: 2,
          state: TIERS_STATES.NONE
        }
      ]
      const store = createStore(userTiers, userLimits, tiers)
      const wrapper = render(store)

      expect(wrapper.text().trim()).toBe('Tier 1 -  In Review Upgrade')
    })

    it('should render "Tier 2 - In Review" if Tier 1 is REJECTED and Tier 2 is PENDING', () => {
      const userTiers = {
        current: 0,
        selected: 2,
        next: 2
      }
      const userLimits = []
      const tiers = [
        {
          index: 1,
          state: TIERS_STATES.REJECTED
        },
        {
          index: 2,
          state: TIERS_STATES.PENDING
        }
      ]
      const store = createStore(userTiers, userLimits, tiers)
      const wrapper = render(store)

      expect(wrapper.text().trim()).toBe('Tier 2 -  In Review')
    })

    it('should render "In Review - Documents Needed" if Tier 1 is REJECTED and Tier 2 is NONE', () => {
      const userTiers = {
        current: 0,
        selected: 1,
        next: 2
      }
      const userLimits = []
      const tiers = [
        {
          index: 1,
          state: TIERS_STATES.REJECTED
        },
        {
          index: 2,
          state: TIERS_STATES.NONE
        }
      ]
      const store = createStore(userTiers, userLimits, tiers)
      const wrapper = render(store)

      expect(wrapper.text().trim()).toBe(
        'Tier 1 -  In Review - Documents Needed Continue'
      )

      const store2 = createStore(
        { ...userTiers, selected: 2 },
        userLimits,
        tiers
      )
      const wrapper2 = render(store2)

      expect(wrapper2.text().trim()).toBe(
        'Tier 1 -  In Review - Documents Needed Continue'
      )
    })

    it('should render Tier 1 limit and "Upgrade" if Tier 1 is VERIFIED and Tier 2 is NONE', () => {
      const userTiers = {
        current: 1,
        selected: 1,
        next: 2
      }
      const userLimits = [
        {
          index: 1,
          annual: 1000,
          currency: 'USD'
        }
      ]
      const tiers = [
        {
          index: 1,
          state: TIERS_STATES.VERIFIED
        },
        {
          index: 2,
          state: TIERS_STATES.NONE
        }
      ]
      const store = createStore(userTiers, userLimits, tiers)
      const wrapper = render(store)

      expect(wrapper.text().trim()).toBe(
        'Tier 1 -  $1,000.00 Available Upgrade'
      )

      const store2 = createStore(
        { ...userTiers, selected: 2 },
        userLimits,
        tiers
      )
      const wrapper2 = render(store2)

      expect(wrapper2.text().trim()).toBe(
        'Tier 1 -  $1,000.00 Available Upgrade'
      )
    })

    it('should render Tier 1 limit and if Tier 1 is VERIFIED and Tier 2 is REJECTED', () => {
      const userTiers = {
        current: 1,
        selected: 2,
        next: 2
      }
      const userLimits = [
        {
          index: 1,
          annual: 1000,
          currency: 'USD'
        }
      ]
      const tiers = [
        {
          index: 1,
          state: TIERS_STATES.VERIFIED
        },
        {
          index: 2,
          state: TIERS_STATES.REJECTED
        }
      ]
      const store = createStore(userTiers, userLimits, tiers)
      const wrapper = render(store)

      expect(wrapper.text().trim()).toBe('Tier 1 -  $1,000.00 Available')
    })

    it('should render Tier 1 limit and "In Review" if Tier 1 is VERIFIED and Tier 2 is PENDING', () => {
      const userTiers = {
        current: 1,
        selected: 2,
        next: 2
      }
      const userLimits = [
        {
          index: 1,
          annual: 1000,
          currency: 'USD'
        }
      ]
      const tiers = [
        {
          index: 1,
          state: TIERS_STATES.VERIFIED
        },
        {
          index: 2,
          state: TIERS_STATES.PENDING
        }
      ]
      const store = createStore(userTiers, userLimits, tiers)
      const wrapper = render(store)

      expect(wrapper.text().trim()).toBe(
        'Tier 1 -  $1,000.00 Available Tier 2 In Review'
      )
    })

    it('should render Tier 2 limit if Tier 2 is VERIFIED', () => {
      const userTiers = {
        current: 2,
        selected: 2,
        next: 2
      }
      const userLimits = [
        {
          index: 1,
          annual: 1000,
          currency: 'USD'
        },
        {
          index: 2,
          annual: 10000,
          currency: 'USD'
        }
      ]
      const tiers = [
        {
          index: 1,
          state: TIERS_STATES.VERIFIED
        },
        {
          index: 2,
          state: TIERS_STATES.VERIFIED
        }
      ]
      const store = createStore(userTiers, userLimits, tiers)
      const wrapper = render(store)

      expect(wrapper.text().trim()).toBe('Tier 2 -  $10,000.00 Available')
    })
  })
})
