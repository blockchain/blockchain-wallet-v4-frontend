import { combineReducers } from 'redux'
import { createTestStore, getDispatchSpyReducer, TestBed } from 'utils/testbed'
import { mount } from 'enzyme'
import React from 'react'

import { AcceptTermsForm } from './template'
import { coreReducers, paths, Remote } from 'blockchain-wallet-v4/src'
import AcceptTerms from './index'
import modalsReducer from 'data/modals/reducers'

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
        <AcceptTerms coinifyBusy={Remote.Success({})} />
      </TestBed>
    )
  })

  describe('modal rendering', () => {
    it('should render', () => {
      expect(wrapper.find(AcceptTermsForm)).toHaveLength(1)
    })
  })
})
