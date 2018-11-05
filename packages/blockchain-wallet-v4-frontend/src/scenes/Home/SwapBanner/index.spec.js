import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { SwapBanner } from './index'

jest.mock('blockchain-info-components', () => ({
  Button: 'button',
  Text: 'text'
}))

describe('SwapBanner', () => {
  it('renders correctly', () => {
    const component = shallow(<SwapBanner showBanner />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
