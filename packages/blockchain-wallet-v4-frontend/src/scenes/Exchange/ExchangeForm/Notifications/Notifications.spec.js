import { actions } from 'data'
import { createTestStore, getDispatchSpyReducer, TestBed } from 'utils/testbed'
import { mount } from 'enzyme'
import { TIERS_STATES } from 'data/modules/profile/model'
import LimitInfo from './index'
import profileReducer from 'data/modules/profile/reducers'
import React from 'react'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

describe('Swap Notifications', () => {
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
    it('should render notification if Tier 1 and Tier 2 are rejected', () => {
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

      expect(wrapper.html()).not.toBeNull()
    })
  })
})
