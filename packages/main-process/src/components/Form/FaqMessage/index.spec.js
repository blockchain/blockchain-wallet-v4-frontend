import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import FaqMessage from './index.js'

describe('FooterShadowWrapper', () => {
  it('renders correctly', () => {
    const props = { title: <div />, text: <div />, className: 'cn' }
    const component = shallow(<FaqMessage {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
