import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import NumberInput from './NumberInput'

describe('NumberInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(<NumberInput />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
