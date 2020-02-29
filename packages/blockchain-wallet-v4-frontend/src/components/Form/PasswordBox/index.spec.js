import { shallow } from 'enzyme'
import PasswordBox from './index.js'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => {
  return {
    Text: jest.fn(),
    Icon: jest.fn(),
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
