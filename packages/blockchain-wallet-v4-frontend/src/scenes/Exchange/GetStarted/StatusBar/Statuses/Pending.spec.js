import { Pending } from './Pending'
import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => ({
  Text: 'text'
}))

describe('Pending', () => {
  it('renders correctly', () => {
    const component = shallow(<Pending />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
