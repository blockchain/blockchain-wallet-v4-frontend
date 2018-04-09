
import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { testPropTypes } from 'tests/utils'
import { TimeFiltersContainer } from './index'

describe('TimeFilters container', () => {
  beforeEach(() => {
    jest.mock('./template', () => 'template')
    jest.mock('data', () => { })
  })

  afterEach(() => {
    jest.unmock('./template', () => 'template')
    jest.unmock('data', () => { })
  })

  it('renders correctly', () => {
    const baseProps = { time: 'all' }
    const component = shallow(<TimeFiltersContainer {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should accept a mandatory string for prop time', () => {
    const testValues = [
      ['all', 'day', 'week', 'month', 'year'],
      [0, undefined, null, {}]
    ]
    testPropTypes(TimeFiltersContainer, 'time', testValues)
  })
})
