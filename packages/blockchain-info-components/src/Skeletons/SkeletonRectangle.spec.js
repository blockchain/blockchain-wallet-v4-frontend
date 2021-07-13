import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import SkeletonRectangle from './SkeletonRectangle'

describe('SkeletonRectangle component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <SkeletonRectangle height='10px' width='10px' bgColorgrey000>
        <span>Test</span>
      </SkeletonRectangle>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
