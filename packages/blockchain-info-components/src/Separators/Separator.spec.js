import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import Separator from './Separator'

describe('Separator component', () => {
  it('default renders correctly', () => {
    const component = shallow(<Separator align='right' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
