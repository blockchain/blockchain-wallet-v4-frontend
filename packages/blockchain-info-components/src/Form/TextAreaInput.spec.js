import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import TextAreaInput from './TextAreaInput'

describe('TextAreaInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(<TextAreaInput bordercolor='red600' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
