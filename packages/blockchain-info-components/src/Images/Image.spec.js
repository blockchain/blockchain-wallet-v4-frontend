import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Image from './Image'

describe('Image component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <Image name='testing' width='10px' height='10px' />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
