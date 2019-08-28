import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { CurrencyItem } from './Lockbox'

jest.mock('blockchain-info-components', () => ({
  Banner: '',
  Text: '',
  Icon: ''
}))
describe('Lockbox Balances Component', () => {
  it('should render and match default snapshot', () => {
    const component = shallow(<CurrencyItem isSaved={true} coin='btc' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should prompt user to use Chrome if coin is not saved', () => {
    jest.mock('bowser', () => ({
      name: 'NotChrome'
    }))
    const component = shallow(<CurrencyItem isSaved={false} coin='btc' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should prompt user to user to add coin if not saved and browser Chrome', () => {
    jest.mock('bowser', () => ({
      name: 'Chrome'
    }))
    const component = shallow(<CurrencyItem isSaved={true} coin='btc' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
