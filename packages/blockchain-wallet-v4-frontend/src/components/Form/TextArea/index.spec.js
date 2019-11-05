import { shallow } from 'enzyme'
import React from 'react'
import TextArea from './index.js'
import toJson from 'enzyme-to-json'
jest.mock('blockchain-info-components', () => ({
  Text: 'text',
  TextAreaInput: 'text-area-input'
}))

describe('TextArea', () => {
  it('renders correctly', () => {
    const props = { meta: {} }
    const component = shallow(<TextArea {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
