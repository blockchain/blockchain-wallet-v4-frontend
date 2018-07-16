import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import PasswordScore from './index.js'
jest.mock('blockchain-info-components', () => ({ PasswordGauge: 'password-gauge' }))

describe('PasswordScore', () => {
  it('renders correctly', () => {
    const props = { value: 'password123' }
    const component = shallow(<PasswordScore {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
