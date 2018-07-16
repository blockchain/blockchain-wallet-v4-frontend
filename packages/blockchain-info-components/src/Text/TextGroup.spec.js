import React from 'react'
import renderer from 'react-test-renderer'
import 'jest-styled-components'

import TextGroup from './TextGroup'

describe('TextGroup component', () => {
  it('default renders correctly', () => {
    const component = renderer.create(<TextGroup nowrap inline><span>Hello World</span></TextGroup>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
