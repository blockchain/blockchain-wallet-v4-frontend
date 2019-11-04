import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import NumberInput from './NumberInput'

describe('NumberInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(<NumberInput borderColor='red' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
