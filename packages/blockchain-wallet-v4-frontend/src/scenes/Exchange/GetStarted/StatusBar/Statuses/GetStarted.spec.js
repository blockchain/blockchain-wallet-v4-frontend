import { shallow } from 'enzyme'
import GetStarted from './GetStarted'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => ({
  Button: 'button'
}))

describe('GetStarted', () => {
  it('renders correctly', () => {
    const component = shallow(<GetStarted />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
