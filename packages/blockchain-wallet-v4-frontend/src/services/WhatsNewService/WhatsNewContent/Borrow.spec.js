import { shallow } from 'enzyme'
import Borrow from './Borrow'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => ({
  Text: 'text',
  Button: 'button'
}))

describe('EmptyContent', () => {
  it('renders correctly', () => {
    const component = shallow(<Borrow />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
