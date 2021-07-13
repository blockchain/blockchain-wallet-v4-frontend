import React from 'react'
import { shallow } from 'enzyme'
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
