import React from 'react'
import FormError from './index.js'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('FormError', () => {
  it('renders correctly', () => {
    const component = renderer.create(<FormError />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
