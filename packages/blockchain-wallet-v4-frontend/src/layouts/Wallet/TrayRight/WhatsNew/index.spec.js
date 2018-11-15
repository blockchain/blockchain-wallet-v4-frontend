import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import WhatsNew from './index'

jest.mock('./WhatsNewContent/ExchangeByBlockchain', () => 'exchangeByBlockchain')

describe('Whats New', () => {
  it('renders correctly', () => {
    const component = shallow(<WhatsNew />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
