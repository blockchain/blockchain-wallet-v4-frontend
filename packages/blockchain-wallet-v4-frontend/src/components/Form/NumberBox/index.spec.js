import { shallow } from 'enzyme'
import NumberBox from './index.js'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => {
  return {
    Icon: jest.fn(),
    Text: jest.fn(),
    NumberInput: jest.fn()
  }
})

describe('NumberBox', () => {
  it('renders correctly', () => {
    const props = { meta: {} }
    const component = shallow(<NumberBox {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
