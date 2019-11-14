import 'jest-styled-components'
import FormGroup from './index.js'
import React from 'react'
import renderer from 'react-test-renderer'

describe('FormGroup', () => {
  it('renders correctly', () => {
    const props = { margin: '20px' }
    const component = renderer.create(<FormGroup {...props} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
