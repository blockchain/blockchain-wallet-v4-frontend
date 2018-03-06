import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import DateInput from './DateInput'

describe('DateInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(<DateInput borderColor='red' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
