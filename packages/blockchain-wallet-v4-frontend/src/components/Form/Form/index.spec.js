import { shallow } from 'enzyme'
import Form from './index.js'
import React from 'react'
import toJson from 'enzyme-to-json'

describe('Form', () => {
  it('renders correctly', () => {
    const props = { override: true, onSubmit: jest.fn() }
    const component = shallow(<Form {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
