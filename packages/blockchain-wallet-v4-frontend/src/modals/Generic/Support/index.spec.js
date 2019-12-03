import { shallow } from 'enzyme'
import { Support } from './index'
import React from 'react'
import toJson from 'enzyme-to-json'

describe('Support modal component', () => {
  it('matches snapshot', () => {
    const component = shallow(<Support />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
