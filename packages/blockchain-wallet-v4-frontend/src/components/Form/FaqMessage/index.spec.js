import { shallow } from 'enzyme'
import FaqMessage from './index.js'
import React from 'react'
import toJson from 'enzyme-to-json'

describe('FooterShadowWrapper', () => {
  it('renders correctly', () => {
    const props = { title: <div />, text: <div />, className: 'cn' }
    const component = shallow(<FaqMessage {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
