import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Text from './Text'

describe('Text component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <Text colorgrey000 altFont>
        <span>Hello World</span>
      </Text>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
