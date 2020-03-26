import { ExchangeScene } from './index'
import { Remote } from 'blockchain-wallet-v4/src'
import { shallow } from 'enzyme'
import DataError from 'components/DataError'
import ExchangeContainer from './ExchangeContainer'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => ({
  Banner: 'Banner',
  BlockchainLoader: 'BlockchainLoader',
  Button: 'Button',
  FlatLoader: 'FlatLoader',
  Icon: 'Icon',
  IconButton: 'IconButton',
  Image: 'Image',
  Link: 'Link',
  Text: 'Text',
  TextInput: 'TextInput',
  TextGroup: 'TextGroup'
}))

const FROM = 'BTC'
const TO = 'ETH'

const props = {
  hasEmail: true,
  logEnterExchange: jest.fn(),
  fetchUser: jest.fn(),
  location: {
    state: {
      from: FROM,
      to: TO
    }
  }
}

describe('ExchangeScene', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('renders email required screen correctly', () => {
    const component = shallow(<ExchangeScene {...props} hasEmail={false} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('calls fetchUser at start', () => {
    const component = shallow(<ExchangeScene {...props} hasEmail={false} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('renders loading correctly', () => {
    const component = shallow(
      <ExchangeScene userCreated={Remote.Loading} {...props} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('renders not asked correctly', () => {
    const component = shallow(
      <ExchangeScene userCreated={Remote.NotAsked} {...props} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('renders exchange correctly', () => {
    const component = shallow(
      <ExchangeScene userCreated={Remote.Success(true)} {...props} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
    const exchange = component.find(ExchangeContainer)
    expect(exchange.prop('from')).toBe(FROM)
    expect(exchange.prop('to')).toBe(TO)
  })
  it('renders getstarted correctly', () => {
    const component = shallow(
      <ExchangeScene userCreated={Remote.Success(false)} {...props} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('renders failure correctly', () => {
    const component = shallow(
      <ExchangeScene userCreated={Remote.Failure({})} {...props} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
    const dataError = component.find(DataError)
    dataError.prop('onClick')()
    expect(props.fetchUser).toHaveBeenCalledTimes(1)
  })
})
