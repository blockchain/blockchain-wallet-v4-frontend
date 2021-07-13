import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import PasswordInput from './PasswordInput'

describe('PasswordInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(<PasswordInput />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
