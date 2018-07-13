import React from 'react'
import FormGroup from './index.js'
import renderer from 'react-test-renderer'
import 'jest-styled-components'

describe('FormGroup', () => {
  it('renders correctly', () => {
    const props = { margin: '20px' }
    const component = renderer.create(<FormGroup {...props} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
