import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import DateInput from './index'

describe('DateInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(<DateInput bordercolor='red600' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
