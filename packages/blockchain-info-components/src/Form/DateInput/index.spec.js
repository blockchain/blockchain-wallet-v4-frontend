import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import DateInput from './index'

describe('DateInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(<DateInput borderColor='red' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
