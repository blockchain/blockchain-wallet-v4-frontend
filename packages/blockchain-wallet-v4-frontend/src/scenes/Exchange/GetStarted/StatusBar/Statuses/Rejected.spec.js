import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Rejected } from './Rejected'

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
