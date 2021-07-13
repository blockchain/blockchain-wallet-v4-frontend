import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import PaginationItem from './PaginationItem'

describe('PaginationItem component', () => {
  it('default renders correctly', () => {
    const component = shallow(<PaginationItem selected />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
