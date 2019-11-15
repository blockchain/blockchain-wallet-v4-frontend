import { shallow } from 'enzyme'
import { SwapBanner } from './index'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => ({
  Button: 'button',
  Text: 'text',
  Image: 'image'
}))

describe('SwapBanner', () => {
  it('renders null w/o showBanner', () => {
    const component = shallow(<SwapBanner />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with getstarted button', () => {
    const component = shallow(<SwapBanner showBanner kycNotFinished />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with exchange link', () => {
    const component = shallow(<SwapBanner showBanner />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
