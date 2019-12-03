import 'jest-styled-components'
import FormItem from './index.js'
import React from 'react'
import renderer from 'react-test-renderer'
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('FormItem', () => {
  it('renders correctly', () => {
    const component = renderer.create(<FormItem htmlFor={'comp'} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
