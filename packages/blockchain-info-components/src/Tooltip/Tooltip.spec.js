import 'jest-styled-components'
import React from 'react'
import renderer from 'react-test-renderer'
import Tooltip from './template'

describe('Tooltip component', () => {
  it('renders correctly', () => {
    const component = renderer.create(
      <Tooltip id={'tip'}>
        <span>Tool Text</span>
      </Tooltip>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
