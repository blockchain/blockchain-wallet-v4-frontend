import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import { combineReducers } from 'redux'

import { coreReducers, paths } from 'blockchain-wallet-v4/src'
import modalsReducer from 'data/modals/reducers'
import AcceptTerms from './index'

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
      expect(wrapper.find('Field[name="terms"]')).toHaveLength(1)
    })

    it('should should be disabled with terms not clicked', () => {
      expect(
        wrapper
          .find('Field[name="terms"]')
          .find('input')
          .props().checked
      ).toBe(false)
      expect(wrapper.find('button').props().disabled).toBe(true)
    })
  })
})
