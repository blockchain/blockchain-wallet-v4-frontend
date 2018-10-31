import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { UserExists } from './index'

const props = {
  email: 'test@blockchain.com'
}

describe('User Exists modal', () => {
  it('Renders correctly', () => {
    const component = shallow(<UserExists {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
