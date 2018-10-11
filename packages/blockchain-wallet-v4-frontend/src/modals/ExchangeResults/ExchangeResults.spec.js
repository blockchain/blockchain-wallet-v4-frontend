import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { ExchangeResults } from './index'

const BASE_PROPS = {
  id: 'ede39566-1f0d-4e48-96fa-b558b70e46b7',
  sourceCoin: 'BTC',
  targetCoin: 'ETH',
  depositAmount: '0.008022',
  withdrawalAmount: '0.1337',
  targetFiat: '1000',
  currency: 'USD',
  rate: '0.06',
  fee: '0.0001'
}

const PENDING_EXECUTION = {
  ...BASE_PROPS,
  status: 'PENDING_EXECUTION'
}
const FAILED = {
  ...BASE_PROPS,
  status: 'FAILED'
}
const PENDING_DEPOSIT = {
  ...BASE_PROPS,
  status: 'PENDING_DEPOSIT'
}
const EXPIRED = {
  ...BASE_PROPS,
  status: 'EXPIRED'
}
const PENDING_REFUND = {
  ...BASE_PROPS,
  refundAmount: '0.1336',
  status: 'PENDING_REFUND'
}
const REFUNDED = {
  ...BASE_PROPS,
  refundAmount: '0.1336',
  status: 'REFUNDED'
}
const PENDING_WITHDRAWAL = {
  ...BASE_PROPS,
  status: 'PENDING_WITHDRAWAL'
}
const FINISHED = {
  ...BASE_PROPS,
  status: 'FINISHED'
}

describe('Exchange Results', () => {
  it('PENDING_EXECUTION renders correctly', () => {
    const component = shallow(<ExchangeResults {...PENDING_EXECUTION} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('FAILED renders correctly', () => {
    const component = shallow(<ExchangeResults {...FAILED} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('PENDING_DEPOSIT renders correctly', () => {
    const component = shallow(<ExchangeResults {...PENDING_DEPOSIT} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('EXPIRED renders correctly', () => {
    const component = shallow(<ExchangeResults {...EXPIRED} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('PENDING_REFUND renders correctly', () => {
    const component = shallow(<ExchangeResults {...PENDING_REFUND} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('REFUNDED renders correctly', () => {
    const component = shallow(<ExchangeResults {...REFUNDED} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('PENDING_WITHDRAWAL renders correctly', () => {
    const component = shallow(<ExchangeResults {...PENDING_WITHDRAWAL} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('FINISHED renders correctly', () => {
    const component = shallow(<ExchangeResults {...FINISHED} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
