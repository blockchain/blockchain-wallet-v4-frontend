import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import RadioButtonInput from './RadioButtonInput'

describe('RadioButtonInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <RadioButtonInput name='test' props={{}} checked disabled='false'>
        <span>test</span>
      </RadioButtonInput>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
