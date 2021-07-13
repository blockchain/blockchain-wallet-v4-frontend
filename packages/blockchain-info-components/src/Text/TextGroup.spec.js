import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import TextGroup from './TextGroup'

describe('TextGroup component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <TextGroup nowrap inline>
        <span>Hello World</span>
      </TextGroup>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
