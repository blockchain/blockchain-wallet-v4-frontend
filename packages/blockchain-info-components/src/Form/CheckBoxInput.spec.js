import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import CheckBoxInput from './CheckBoxInput'

describe('CheckBoxInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <CheckBoxInput name='terms' checked disabled='false'>
        <span>test</span>
      </CheckBoxInput>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
