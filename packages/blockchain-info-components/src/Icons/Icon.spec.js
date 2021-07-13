import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Icon from './Icon'

describe('Icon component', () => {
  it('default renders correctly', () => {
    const component = shallow(<Icon name='test' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
