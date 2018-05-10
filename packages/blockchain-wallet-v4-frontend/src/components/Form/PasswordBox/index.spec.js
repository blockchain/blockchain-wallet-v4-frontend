import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import PasswordBox from './index.js'

jest.mock('blockchain-info-components', () => {
  return {
    Text: jest.fn(),
    PasswordInput: jest.fn()
  }
})

describe('PasswordBox', () => {
  it('renders correctly', () => {
    const props = { meta: {} }
    const component = shallow(<PasswordBox {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
