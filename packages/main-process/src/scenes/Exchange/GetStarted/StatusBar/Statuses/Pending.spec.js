import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Pending } from './Pending'

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
