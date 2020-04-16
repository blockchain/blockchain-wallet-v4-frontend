import { shallow } from 'enzyme'
import FormGroup from './index.js'
import React from 'react'
import toJson from 'enzyme-to-json'

describe('FormGroup', () => {
  it('renders correctly', () => {
    const props = { margin: '20px' }
    const tree = toJson(shallow(<FormGroup {...props} />))
    expect(tree).toMatchSnapshot()
  })
})
