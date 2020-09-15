import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import SkeletonCircle from './SkeletonCircle'

describe('SkeletonCircle component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <SkeletonCircle height='10px' width='10px' bgColorgrey000 />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
