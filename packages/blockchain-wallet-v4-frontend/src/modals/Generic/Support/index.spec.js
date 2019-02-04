import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { Support } from './index'

describe('Support modal component', () => {
  it('matches snapshot', () => {
    const component = shallow(<Support />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
