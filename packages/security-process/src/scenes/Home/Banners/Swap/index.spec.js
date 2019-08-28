import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { SwapBanner } from './index'

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
