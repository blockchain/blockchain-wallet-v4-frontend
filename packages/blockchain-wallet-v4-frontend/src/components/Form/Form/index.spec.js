import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Form from './index.js'

describe('Form', () => {
  it('renders correctly', () => {
    const props = { override: true }
    const component = shallow(<Form {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
