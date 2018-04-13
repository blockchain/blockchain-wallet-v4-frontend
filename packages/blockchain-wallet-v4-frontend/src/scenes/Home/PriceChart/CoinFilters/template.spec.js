import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { testPropTypes } from 'utils/tests'
import CoinFilters from './template'
jest.mock('./CoinTicker', () => 'CoinTicker')

describe('CoinFilters component', () => {
  it('renders correctly', () => {
    const baseProps = { coin: 'BTC', handleClick: jest.fn() }
    const component = shallow(<CoinFilters {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should accept a mandatory string BTC, ETH or BCH for prop coin', () => {
    const testValues = [
      ['BTC', 'BCH', 'ETH'],
      [0, '', undefined, null, {}]
    ]
    testPropTypes(CoinFilters, 'time', testValues, { handleClick: jest.fn() })
  })

  it('should accept a mandatory function for prop handleClick', () => {
    const testValues = [
      [jest.fn()],
      [0, '', undefined, null, {}]
    ]
    testPropTypes(CoinFilters, 'handleClick', testValues, { time: 'all' })
  })
})
