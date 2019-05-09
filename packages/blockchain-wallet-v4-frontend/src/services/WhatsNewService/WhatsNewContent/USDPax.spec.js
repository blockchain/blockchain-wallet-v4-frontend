import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import USDPax from './USDPax'

jest.mock('blockchain-info-components', () => ({
  Text: 'text',
  Button: 'button'
}))

describe('EmptyContent', () => {
  it('renders correctly', () => {
    const component = shallow(<USDPax />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
