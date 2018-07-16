import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { testPropTypes } from 'utils/test.utils'
import TimeFilters from './template'

jest.mock('react-intl')
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('TimeFilters component', () => {
  it('renders correctly', () => {
    const baseProps = { time: '1month', handleClick: jest.fn() }
    const component = shallow(<TimeFilters {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should accept a mandatory string for prop time', () => {
    expect(testPropTypes(TimeFilters, 'time', ['all', '1day', '1week', '1month', '1year'], false, { handleClick: jest.fn() })).toBeTruthy()
    expect(testPropTypes(TimeFilters, 'time', [0, '', undefined, null, {}], true, { handleClick: jest.fn() })).toBeTruthy()
  })

  it('should accept a mandatory function for prop handleClick', () => {
    expect(testPropTypes(TimeFilters, 'handleClick', [jest.fn()], false, { time: '1month' })).toBeTruthy()
    expect(testPropTypes(TimeFilters, 'handleClick', [0, '', undefined, null, {}], true, { time: '1month' })).toBeTruthy()
  })

  it('executes handleClick props on click with correct time value', () => {
    const baseProps = { time: '1month', handleClick: jest.fn() }
    const component = shallow(<TimeFilters {...baseProps} />)
    const element = component.childAt(2)
    element.simulate('click')
    expect(baseProps.handleClick).toHaveBeenCalledTimes(1)
    expect(baseProps.handleClick).toHaveBeenCalledWith(baseProps.time)
  })
})
