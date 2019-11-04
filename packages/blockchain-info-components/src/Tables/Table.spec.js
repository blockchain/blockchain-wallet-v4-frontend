import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import Table from './Table'

describe('Table component', () => {
  it('renders correctly', () => {
    const component = shallow(
      <Table>
        <span>Default</span>
      </Table>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
