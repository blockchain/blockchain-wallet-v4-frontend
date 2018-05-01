import React from 'react'
import renderer from 'react-test-renderer'
import 'jest-styled-components'

import Text from './Text'

describe('Text component', () => {
  it('default renders correctly', () => {
    const component = renderer.create(<Text color='gray-1' altFont><span>Hello World</span></Text>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
