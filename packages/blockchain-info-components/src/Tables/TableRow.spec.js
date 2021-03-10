import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import TableRow from './TableRow'

describe('TableRow component', () => {
  it('renders correctly', () => {
    const component = shallow(
      <TableRow>
        <span>Default</span>
      </TableRow>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
