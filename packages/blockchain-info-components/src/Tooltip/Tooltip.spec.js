import React from 'react'
import Tooltip from './template.js'
import renderer from 'react-test-renderer'
import 'jest-styled-components'

describe('Tooltip component', () => {
  it('renders correctly', () => {
    const component = renderer.create(
      <Tooltip
        colors={'primary'}
        width={100}
        onMouseEnter={jest.fn()}
        onMouseLeave={jest.fn()}
      >
        <span>Default</span>
      </Tooltip>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
