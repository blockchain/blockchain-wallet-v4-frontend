import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import TextAreaInput from './TextAreaInput'

describe('TextAreaInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(<TextAreaInput />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
