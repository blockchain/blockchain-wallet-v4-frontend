import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import TableHeader from './TableHeader'

describe('TableHeader component', () => {
  it('renders correctly', () => {
    const component = shallow(
      <TableHeader>
        <span>Default</span>
      </TableHeader>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
