
import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { assoc, dissoc } from 'ramda'
import { testPropTypes } from 'utils/tests'
import { CoinTickerContainer } from './index'
import { Remote } from 'blockchain-wallet-v4/src'
jest.mock('./template.success', () => 'template.success')
jest.mock('./template.error', () => 'template.error')
jest.mock('./template.loading', () => 'template.loading')
jest.mock('data', () => ({}))

describe('CoinTicker container', () => {
  const props = { data: Remote.Success(''), handleClick: jest.fn(), coin: 'BTC', actions: { initialized: jest.fn() } }

  it('renders correctly (Success)', () => {
    const component = shallow(<CoinTickerContainer {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly (Failure)', () => {
    const component = shallow(<CoinTickerContainer {...assoc('data', Remote.Failure(''), props)} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly (Loading)', () => {
    const component = shallow(<CoinTickerContainer {...assoc('data', Remote.Loading, props)} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly (NotAsked)', () => {
    const component = shallow(<CoinTickerContainer {...assoc('data', Remote.NotAsked, props)} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should accept a mandatory bool for prop selected', () => {
    const testValues = [
      [true, false],
      [100]
    ]
    testPropTypes(CoinTickerContainer, 'selected', testValues, dissoc('selected', props))
  })

  it('should accept a mandatory function for prop handleClick', () => {
    const testValues = [
      [jest.fn()],
      [0, undefined, null, {}]
    ]
    testPropTypes(CoinTickerContainer, 'handleClick', testValues, dissoc('handleClick', props))
  })

  it('should accept a mandatory string for prop coin', () => {
    const testValues = [
      ['BTC', 'ETH', 'BCH'],
      [0, undefined, null, {}]
    ]
    testPropTypes(CoinTickerContainer, 'coin', testValues, dissoc('coin', props))
  })
})
