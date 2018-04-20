
import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { testPropTypes } from 'utils/tests'
import { TimeFiltersContainer } from './index'
jest.mock('./template', () => 'template')
jest.mock('data', () => ({ }))

describe('TimeFilters container', () => {
  it('renders correctly', () => {
    const baseProps = { time: '1month' }
    const component = shallow(<TimeFiltersContainer {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should accept a mandatory string for prop time', () => {
    const testValues = [
      ['all', '1day', '1week', '1month', '1year'],
      [0, undefined, null, {}]
    ]
    testPropTypes(TimeFiltersContainer, 'time', testValues)
  })
})
