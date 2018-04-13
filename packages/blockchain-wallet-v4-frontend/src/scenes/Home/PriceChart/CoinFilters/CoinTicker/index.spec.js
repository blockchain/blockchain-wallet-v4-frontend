
import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { testPropTypes } from 'utils/tests'
import { CoinTickerContainer } from './index'
import { Remote } from 'blockchain-wallet-v4/src'
jest.mock('./template.success', () => 'template.success')
jest.mock('./template.error', () => 'template.error')
jest.mock('./template.loading', () => 'template.loading')
jest.mock('data', () => ({}))

describe('CoinTicker', () => {
  it('renders correctly (Success)', () => {
    const baseProps = { data: Remote.Success(), selected: true, handleClick: jest.fn() }
    const component = shallow(<CoinTickerContainer {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly (Failure)', () => {
    const baseProps = { data: Remote.Failure(), selected: true, handleClick: jest.fn() }
    const component = shallow(<CoinTickerContainer {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly (Loading)', () => {
    const baseProps = { data: Remote.Loading, selected: true, handleClick: jest.fn() }
    const component = shallow(<CoinTickerContainer {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly (NotAsked)', () => {
    const baseProps = { data: Remote.NotAsked, selected: true, handleClick: jest.fn() }
    const component = shallow(<CoinTickerContainer {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should accept a mandatory Remote for prop data', () => {
    const testValues = [
      [Remote.Success(), Remote.Failure(), Remote.Loading, Remote.NotAsked],
      [0, undefined, null, {}]
    ]
    testPropTypes(CoinTickerContainer, 'coin', testValues, { selected: true, handleClick: jest.fn() })
  })

  it('should accept a mandatory bool for prop selected', () => {
    const testValues = [
      [true, false],
      [0, undefined, null, {}]
    ]
    testPropTypes(CoinTickerContainer, 'coin', testValues, { data: Remote.Loading, handleClick: jest.fn() })
  })

  it('should accept a mandatory function for prop handleClick', () => {
    const testValues = [
      [jest.fn()],
      [0, undefined, null, {}]
    ]
    testPropTypes(CoinTickerContainer, 'coin', testValues, { data: Remote.Loading, selected: true })
  })
})
