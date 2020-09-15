import { shallow } from 'enzyme'
import React from 'react'
import TextGroup from './TextGroup'
import toJson from 'enzyme-to-json'

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
