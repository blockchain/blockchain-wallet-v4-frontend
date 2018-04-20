import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { testPropTypes } from 'utils/tests'
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
    const testValues = [
      ['all', '1day', '1week', '1month', '1year'],
      [0, '', undefined, null, {}]
    ]
    testPropTypes(TimeFilters, 'time', testValues, { handleClick: jest.fn() })
  })

  it('should accept a mandatory function for prop handleClick', () => {
    const testValues = [
      [jest.fn()],
      [0, '', undefined, null, {}]
    ]
    testPropTypes(TimeFilters, 'handleClick', testValues, { time: '1month' })
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
