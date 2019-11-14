import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import TableCell from './TableCell'

describe('TableCell component', () => {
  it('renders correctly', () => {
    const component = shallow(
      <TableCell>
        <span>Default</span>
      </TableCell>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
