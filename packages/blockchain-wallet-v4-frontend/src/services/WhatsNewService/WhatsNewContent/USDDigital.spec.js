import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'
import USDDigital from './USDDigital'

jest.mock('blockchain-info-components', () => ({
  Text: 'text',
  Button: 'button'
}))

describe('EmptyContent', () => {
  it('renders correctly', () => {
    const component = shallow(<USDDigital />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
