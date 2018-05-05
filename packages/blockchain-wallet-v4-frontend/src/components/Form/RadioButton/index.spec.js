import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import RadioButton from './index.js'
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('RadioButton', () => {
  it('renders correctly', () => {
    const props = { meta: {} }
    const component = shallow(<RadioButton {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
