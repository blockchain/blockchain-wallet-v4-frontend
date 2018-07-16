import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Carousel from './template'

describe('Carousel component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <Carousel
        height={12}
        chips={false}
        total={12}
        index={4}
        arrows
        handleClick={() => {}}
      />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
