import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Remote } from 'blockchain-wallet-v4'
import { LockboxShowXPubs } from './index'

jest.mock('blockchain-info-components', () => ({
  Banner: '',
  Text: '',
  Icon: ''
}))

describe('LockboxShowXPubs Modal', () => {
  const mockData = Remote.of({
    btc: 'btcX',
    eth: 'ethX',
    bch: 'bchX',
    xlm: 'xlmX'
  })

  it('should render with correct menu tabs for each coin', () => {
    const component = shallow(
      <LockboxShowXPubs data={mockData} deviceIndex={0} />
    )
    const TabsEl = component.childAt(1).childAt(1)
    expect(TabsEl.children().length).toBe(4)
    expect(TabsEl.childAt(0).hasClass('active')).toBe(true)
  })

  it('should match snapshot', () => {
    const component = shallow(
      <LockboxShowXPubs data={mockData} deviceIndex={0} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
