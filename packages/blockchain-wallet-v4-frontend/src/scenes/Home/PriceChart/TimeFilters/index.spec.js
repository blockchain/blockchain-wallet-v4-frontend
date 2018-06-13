import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { testPropTypes } from 'utils/test.utils'
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
    expect(testPropTypes(TimeFiltersContainer, 'time', ['all', '1day', '1week', '1month', '1year'], false)).toBeTruthy()
    expect(testPropTypes(TimeFiltersContainer, 'time', [0, undefined, null, {}], true)).toBeTruthy()
  })
})
