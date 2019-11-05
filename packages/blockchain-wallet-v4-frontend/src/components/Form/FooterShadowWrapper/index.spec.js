import { shallow } from 'enzyme'
import FooterShadowWrapper from './index.js'
import React from 'react'
import toJson from 'enzyme-to-json'

describe('FooterShadowWrapper', () => {
  it('renders correctly', () => {
    const props = { fields: <div />, footer: <div />, className: 'cn' }
    const component = shallow(<FooterShadowWrapper {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
