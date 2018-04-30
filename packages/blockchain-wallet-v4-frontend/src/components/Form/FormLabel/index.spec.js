import React from 'react'
import FormItem from './index.js'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('FormItem', () => {
  it('renders correctly', () => {
    const component = renderer.create(<FormItem />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
