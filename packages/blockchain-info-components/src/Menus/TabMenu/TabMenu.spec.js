import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import TabMenu from './TabMenu'

describe('TabMenu component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <TabMenu>
        <span>tab</span>
      </TabMenu>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
