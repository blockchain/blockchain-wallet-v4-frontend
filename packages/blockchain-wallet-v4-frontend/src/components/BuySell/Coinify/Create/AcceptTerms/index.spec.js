import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { combineReducers } from 'redux'

// import { actions } from 'data'
import { coreReducers, paths } from 'blockchain-wallet-v4/src'
import modalsReducer from 'data/modals/reducers'

import AcceptTerms from './index'
import { AcceptTermsForm } from './template'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

describe('Coinify AcceptTerms Modal', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer,
    modals: modalsReducer,
    components: combineReducers({}),
    [paths.settingsPath]: coreReducers.settings
  }
  let store
  let wrapper
  beforeEach(() => {
    store = createTestStore(reducers)
    wrapper = mount(
      <TestBed store={store}>
        <AcceptTerms />
      </TestBed>
    )
  })

  describe('modal rendering', () => {
    it('should render', () => {
      expect(wrapper.find(AcceptTermsForm)).toHaveLength(1)
    })
  })
})
