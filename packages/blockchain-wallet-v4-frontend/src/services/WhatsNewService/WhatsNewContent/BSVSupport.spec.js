import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import BSVSupport from './BSVSupport'

jest.mock('blockchain-info-components', () => ({
  Text: 'text',
  Button: 'button'
}))

describe('EmptyContent', () => {
  it('renders correctly', () => {
    const component = shallow(<BSVSupport />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
