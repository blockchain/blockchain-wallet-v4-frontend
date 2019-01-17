import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Summary from './Summary'

const props = {
  sourceCoin: 'BTC',
  targetCoin: 'ETH',
  currency: '$'
}

describe('Exchange Summary', () => {
  it(`should render demo summary correctly`, () => {
    const component = shallow(<Summary {...props} showDemoSummary />)

    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it(`should render summary correctly`, () => {
    const component = shallow(<Summary {...props} showDemoSummary={false} />)

    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
