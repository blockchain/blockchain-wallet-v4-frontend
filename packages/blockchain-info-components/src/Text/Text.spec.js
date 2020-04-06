import 'jest-styled-components'
import React from 'react'
import renderer from 'react-test-renderer'

import Text from './Text'

describe('Text component', () => {
  it('default renders correctly', () => {
    const component = renderer.create(
      <Text colorgrey000 altFont>
        <span>Hello World</span>
      </Text>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
