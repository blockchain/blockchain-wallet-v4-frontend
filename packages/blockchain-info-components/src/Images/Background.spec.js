import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Background from './Background'

describe('Background component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <Background name='testing' width='10px' height='10px' />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
