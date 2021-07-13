import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Tooltip from './template'

describe('Tooltip component', () => {
  it('renders correctly', () => {
    const component = shallow(
      <Tooltip id={'tip'}>
        <span>Tool Text</span>
      </Tooltip>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
