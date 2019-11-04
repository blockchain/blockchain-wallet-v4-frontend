import 'jest-styled-components'
import FormItem from './index.js'
import React from 'react'
import renderer from 'react-test-renderer'
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
