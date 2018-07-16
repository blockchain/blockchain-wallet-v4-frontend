import React from 'react'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import SelectBox from './index.js'
jest.mock('blockchain-info-components', () => ({
  SelectInput: 'select-input'
}))

const fakeInput = {
  onBlur: jest.fn(),
  onChange: jest.fn(),
  onFocus: jest.fn(),
  value: ''
}

const fakeElements = [
  {
    group: 'fakeG',
    items: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 }
    ]
  }
]

describe('SelectBox', () => {
  it('renders correctly', () => {
    const props = { meta: {} }
    const component = renderer.create(
      <SelectBox {...props} input={fakeInput} elements={fakeElements} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
