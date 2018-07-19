import React from 'react'
import Tooltip from './template'
import renderer from 'react-test-renderer'
import 'jest-styled-components'

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
