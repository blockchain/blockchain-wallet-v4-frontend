import { combineReducers } from 'redux'
import { createTestStore, getDispatchSpyReducer, TestBed } from 'utils/testbed'
import { mount } from 'enzyme'
import React from 'react'

import { actions } from 'data'
import { coreReducers, paths } from 'blockchain-wallet-v4/src'
import modalsReducer from 'data/modals/reducers'

import { Code } from './template'
import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'
import MobileNumberVerify from './index'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

describe('MobileNumberVerify Modal', () => {
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
        <MobileNumberVerify />
      </TestBed>
    )
  })

  describe('modal rendering', () => {
    it('should render after action', () => {
      expect(wrapper.find(Modal)).toHaveLength(0)

      store.dispatch(actions.modals.showModal('MobileNumberVerify'))
      wrapper.update()

      expect(wrapper.find(Modal)).toHaveLength(1)
    })

    it('should be hidden after closing', () => {
      store.dispatch(actions.modals.showModal('MobileNumberVerify'))
      wrapper.update()
      wrapper.find(ModalHeader).prop('onClose')()
      wrapper.update()
      expect(wrapper.find(Modal)).toHaveLength(0)
    })
  })

  describe('form for verifying sms number', () => {
    beforeEach(() => {
      store.dispatch(actions.modals.showModal('MobileNumberVerify'))
      wrapper.update()
    })
    it('should render the verify field after modal shows', () => {
      expect(wrapper.find(ModalBody)).toHaveLength(1)
      expect(wrapper.find(Code)).toHaveLength(1)
      expect(wrapper.find('Field[name="code"]')).toHaveLength(1)
    })
  })
})
