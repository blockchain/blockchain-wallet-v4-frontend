import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import PriceChart from './index'
jest.mock('./Chart', () => 'chart')
jest.mock('./CoinFilters', () => 'coinFilters')
jest.mock('./TimeFilters', () => 'timeFilters')
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('PriceChart component', () => {
  it('renders correctly', () => {
    const component = shallow(<PriceChart />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
