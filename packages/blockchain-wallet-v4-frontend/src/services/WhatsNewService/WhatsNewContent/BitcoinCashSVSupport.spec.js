import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import BitcoinCashSVSupport from './BitcoinCashSVSupport'

jest.mock('blockchain-info-components', () => ({
  Text: 'text',
  Button: 'button'
}))

describe('EmptyContent', () => {
  it('renders correctly', () => {
    const component = shallow(<BitcoinCashSVSupport />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
