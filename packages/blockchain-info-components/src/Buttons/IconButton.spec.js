import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import IconButton from './IconButton'

describe('IconButton component', () => {
  it('default renders correctly', () => {
    const component = shallow(<IconButton name='test' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
