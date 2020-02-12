import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import TextInput from './TextInput'

describe('TextInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(<TextInput bordercolor='red600' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
