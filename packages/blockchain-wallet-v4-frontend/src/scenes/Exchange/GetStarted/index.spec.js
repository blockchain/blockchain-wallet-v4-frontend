import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { GetStarted } from './index'

jest.mock('blockchain-info-components', () => ({
  Image: 'image',
  Text: 'text'
}))
jest.mock('./StatusBar', () => 'StatusBar')

describe('StatusBar', () => {
  it('renders correctly', () => {
    const component = shallow(<GetStarted />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
