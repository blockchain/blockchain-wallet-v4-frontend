import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import SecurityGauge from './SecurityGauge'

describe('SecurityGauge component', () => {
  it('default renders correctly', () => {
    const component = shallow(<SecurityGauge score={1} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
