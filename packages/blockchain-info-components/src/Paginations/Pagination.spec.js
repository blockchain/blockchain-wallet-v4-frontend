import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Pagination from './Pagination'

describe('Pagination component', () => {
  it('default renders correctly', () => {
    const component = shallow(<Pagination selected />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
