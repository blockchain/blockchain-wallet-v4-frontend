import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import ButtonGroup from './ButtonGroup'

describe('ButtonGroup component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <ButtonGroup>
        <span>test</span>
      </ButtonGroup>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
