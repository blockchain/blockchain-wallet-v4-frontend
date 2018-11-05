import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { GetStarted } from './GetStarted'

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
