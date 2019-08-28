import React from 'react'
import FormItem from './index.js'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('FormItem', () => {
  it('renders correctly', () => {
    const props = { width: '10%' }
    const component = renderer.create(<FormItem {...props} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('width', '10%')
  })
})
