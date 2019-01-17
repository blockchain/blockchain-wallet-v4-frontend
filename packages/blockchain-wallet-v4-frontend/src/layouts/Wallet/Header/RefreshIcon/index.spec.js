import React from 'react'
import { TestBed, getDispatchSpyReducer, createTestStore } from 'utils/testbed'
import { mount } from 'enzyme'
import RefreshIcon from './index'
import { SpinningIcon } from './template'
import * as actionTypes from 'data/actionTypes'

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

jest.useFakeTimers()

describe('RefreshIcon', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })
  const reducers = {
    spy: spyReducer
  }
  const sagas = []
  let store
  let wrapper
  beforeEach(() => {
    store = createTestStore(reducers, sagas)
    wrapper = mount(
      <TestBed store={store}>
        <RefreshIcon />
      </TestBed>
    )
  })

  describe('Refresh Icon Component', () => {
    it('should render', async () => {
      expect(wrapper.find(SpinningIcon)).toHaveLength(1)
    })

    it('should handle a click', async () => {
      wrapper.find(SpinningIcon).simulate('click')
      const action = dispatchSpy.mock.calls[3]
      expect(action[0]['type']).toEqual(
        actionTypes.components.refresh.REFRESH_CLICKED
      )
    })
  })
})
