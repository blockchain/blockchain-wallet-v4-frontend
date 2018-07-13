import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Button from './Button'

describe('Button component', () => {
  it('default renders correctly', () => {
    const component = shallow(<Button />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
