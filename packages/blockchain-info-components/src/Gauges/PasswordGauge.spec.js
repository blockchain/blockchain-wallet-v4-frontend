import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import PasswordGauge from './PasswordGauge'

describe('PasswordGauge component', () => {
  it('default renders correctly', () => {
    const component = shallow(<PasswordGauge score={1} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
