import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import HeartbeatLoader from './HeartbeatLoader'

describe('HeartbeatLoader component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <HeartbeatLoader height='10px' width='10px' color='blue900' />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
