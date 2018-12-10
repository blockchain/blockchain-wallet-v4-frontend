import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import EmailRequired from './EmailRequired'

describe('EmailRequired component', () => {
  it('renders correctly', () => {
    const component = shallow(<EmailRequired />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
