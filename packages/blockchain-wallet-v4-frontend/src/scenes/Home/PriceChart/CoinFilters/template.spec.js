import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { testPropTypes } from 'utils/test.utils'
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
    expect(testPropTypes(CoinFilters, 'coin', ['BTC', 'BCH', 'ETH'], false, { handleClick: jest.fn() })).toBeTruthy()
    expect(testPropTypes(CoinFilters, 'coin', [0, '', undefined, null, {}], true, { handleClick: jest.fn() })).toBeTruthy()
  })

  it('should accept a mandatory function for prop handleClick', () => {
    expect(testPropTypes(CoinFilters, 'handleClick', [jest.fn()], false, { coin: 'BTC' })).toBeTruthy()
    expect(testPropTypes(CoinFilters, 'handleClick', [0, '', undefined, null, {}], false, { coin: 'BTC' })).toBeTruthy()
  })
})
