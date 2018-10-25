import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import FooterShadowWrapper from './index.js'

describe('FooterShadowWrapper', () => {
  it('renders correctly', () => {
    const props = { fields: <div />, footer: <div />, className: 'cn' }
    const component = shallow(<FooterShadowWrapper {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
