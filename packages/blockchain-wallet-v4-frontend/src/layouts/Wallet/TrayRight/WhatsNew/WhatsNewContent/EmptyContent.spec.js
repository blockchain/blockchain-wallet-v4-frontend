import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import EmptyContent from './EmptyContent'

jest.mock('blockchain-info-components', () => ({
  Text: 'text'
}))

describe('EmptyContent', () => {
  it('renders correctly', () => {
    const component = shallow(<EmptyContent />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
