import { Rejected } from './Rejected'
import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => ({
  Button: 'button',
  ICon: 'icon'
}))

describe('Rejected', () => {
  it('renders correctly', () => {
    const component = shallow(<Rejected />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
