import { shallow } from 'enzyme'
import RadioButton from './index.js'
import React from 'react'
import toJson from 'enzyme-to-json'

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
