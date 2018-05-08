import React from 'react'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import SelectBox from './index.js'
jest.mock('blockchain-info-components', () => ({ SelectInput: 'select-input' }))

describe('SelectBox', () => {
  it('renders correctly', () => {
    const props = { meta: {} }
    const component = renderer.create(<SelectBox {...props} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
