import 'jest-styled-components'
import FormError from './index.js'
import React from 'react'
import renderer from 'react-test-renderer'
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('FormError', () => {
  it('renders correctly', () => {
    const component = renderer.create(<FormError />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
