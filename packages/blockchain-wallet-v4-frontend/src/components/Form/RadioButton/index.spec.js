import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import RadioButton from './index.js'

jest.mock('blockchain-info-components', () => {
  return {
    Text: jest.fn(),
    RadioButtonInput: jest.fn()
  }
})

describe('RadioButton', () => {
  it('renders correctly', () => {
    const props = { meta: {} }
    const component = shallow(<RadioButton {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
