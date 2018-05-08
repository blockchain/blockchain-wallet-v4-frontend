
import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { testPropTypes } from 'utils/test.utils'
import { CoinFiltersContainer } from './index'
jest.mock('./template', () => 'template')
jest.mock('data', () => ({}))

describe('CoinFilters', () => {
  it('renders correctly', () => {
    const baseProps = { coin: 'BTC' }
    const component = shallow(<CoinFiltersContainer {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should accept a mandatory string BTC, BCH or ETH for prop coin', () => {
    expect(testPropTypes(CoinFiltersContainer, 'coin', ['BTC', 'BCH', 'ETH'], false)).toBeTruthy()
    expect(testPropTypes(CoinFiltersContainer, 'coin', [0, undefined, null, {}], true)).toBeTruthy()
  })
})
